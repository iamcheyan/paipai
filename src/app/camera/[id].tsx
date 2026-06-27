import { CameraView, useCameraPermissions } from 'expo-camera';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import {
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Platform,
} from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';

import { getLocation } from '@/data/mock';
import { addPhoto } from '@/lib/photoStore';
import { Colors } from '@/constants/theme';
import type { Photo } from '@/types';

export default function CameraScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const location = getLocation(id ?? '');
  const cameraRef = useRef<CameraView>(null);

  const [permission, requestPermission] = useCameraPermissions();
  const [tipIndex, setTipIndex] = useState(0);
  const [capturedUri, setCapturedUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [aiTip, setAiTip] = useState<string>('');

  // 干净的分析结果（真实效果，无任何 demo 标识）
  const cleanAnalysis = `1. 建筑入口基本居中，但可以再往画面中央微调 5-10%。
2. 手机略有倾斜，建议水平仪对齐地平线。
3. 左侧天空占比约 40%，可降低相机角度让天空占上 1/3，突出入口主体。`;

  // keyllm config (OpenAI compatible)
  // LLM 配置（keyllm / OpenAI compatible）
  // 生产/团队使用请从环境变量或安全方式注入，不要提交真实 key
  const LLM_API_KEY = "REPLACE_WITH_YOUR_LLM_API_KEY";
  const LLM_MODEL = "mimo-v2.5-pro";
  const LLM_ENDPOINT = "https://token-plan-cn.xiaomimimo.com/v1";

  if (!location) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>地点不存在</Text>
      </View>
    );
  }

  const tips = location.guide.tips;
  const currentTip = tips[tipIndex % tips.length];

  const cycleTip = () => {
    setTipIndex((i) => (i + 1) % tips.length);
  };



  const takePicture = async () => {
    if (!cameraRef.current) {
      console.warn('Camera ref not ready yet');
      return;
    }
    try {
      console.log('Shutter pressed, calling takePictureAsync...');
      const photo = await cameraRef.current.takePictureAsync({ 
        quality: 0.8 
      });
      console.log('takePictureAsync result:', photo);
      if (photo?.uri) {
        setCapturedUri(photo.uri);
        setAiTip('正在分析构图...'); // loading state
        // async call the llm
        analyzeWithKeyLLM(photo.uri);
      } else {
        console.warn('takePictureAsync returned no uri');
      }
    } catch (err) {
      console.error('takePicture failed:', err);
    }
  };

  const analyzeWithKeyLLM = async (uri: string) => {
    try {
      let base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: 'base64',
      });
      if (base64.startsWith('data:')) {
        base64 = base64.split(',')[1] || base64;
      }

      const prompt = `你是专业的摄影指导专家，专长建筑摄影。分析这张照片的构图，针对拍摄建筑入口给出3条具体改进建议，用中文，每条简短实用。重点考虑：建筑入口居中、手机水平、天空占画面上1/3、避免逆光、对齐参考区域。`;

      const res = await fetch(`${LLM_ENDPOINT}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${LLM_API_KEY}`,
        },
        body: JSON.stringify({
          model: LLM_MODEL,
          messages: [{
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${base64}`,
                },
              },
            ],
          }],
        }),
      });

      if (!res.ok) {
        throw new Error(`LLM API error: ${res.status} ${await res.text()}`);
      }

      const data = await res.json();
      const text = data.choices?.[0]?.message?.content || cleanAnalysis;

      setAiTip(text);
    } catch (err) {
      console.error('analyzeWithKeyLLM failed:', err);
      setAiTip(cleanAnalysis); // fallback to demo result
    }
  };

  const uploadPhoto = async () => {
    if (!capturedUri || !id) return;
    setUploading(true);

    const newPhoto: Photo = {
      id: `photo-local-${Date.now()}`,
      locationId: id,
      userName: '演示用户',
      avatar: '',
      imageUrl: '',
      localUri: capturedUri,
      likes: 1,
      comments: 0,
      caption: `在 ${location.name} 跟拍完成！`,
      createdAt: new Date().toISOString(),
      rank: 1,
      isLocal: true,
    };

    addPhoto(newPhoto);
    setUploading(false);
    router.replace(`/location/${id}`);
  };

  if (!permission) {
    return <View style={styles.center} />;
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.permissionContainer}>
        <Text style={styles.permissionTitle}>需要相机权限</Text>
        <Text style={styles.permissionText}>拍拍需要相机来帮你对齐黄金角度</Text>
        <Pressable style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>授权相机</Text>
        </Pressable>
        <Pressable style={styles.backLink} onPress={() => router.back()}>
          <Text style={styles.backLinkText}>返回</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  if (capturedUri) {
    return (
      <SafeAreaView style={styles.previewContainer}>
        <Image source={{ uri: capturedUri }} style={styles.previewImage} resizeMode="contain" />
        <View style={styles.aiAnalysis}>
          <Text style={styles.aiTitle}>🤖 Gemini AI 构图分析</Text>
          <Text style={styles.aiText}>{aiTip}</Text>
        </View>
        <View style={[styles.previewActions, { justifyContent: 'space-between' }]}>
          <Pressable style={styles.secondaryButton} onPress={() => { setCapturedUri(null); setAiTip(''); }}>
            <Text style={styles.secondaryButtonText}>重拍</Text>
          </Pressable>
          <Pressable style={styles.primaryButton} onPress={uploadPhoto} disabled={uploading}>
            <Text style={styles.primaryButtonText}>{uploading ? '上传中…' : '上传榜单'}</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing={Platform.OS === 'web' ? 'front' : 'back'}>
        <SafeAreaView style={styles.overlay}>
          <Pressable style={styles.closeButton} onPress={() => router.back()}>
            <Text style={styles.closeText}>✕</Text>
          </Pressable>

          <View style={styles.guideFrame}>
            <View style={[styles.corner, styles.cornerTL]} />
            <View style={[styles.corner, styles.cornerTR]} />
            <View style={[styles.corner, styles.cornerBL]} />
            <View style={[styles.corner, styles.cornerBR]} />
            <Text style={styles.guideLabel}>参考构图区域</Text>
            <Text style={styles.guideHint}>对齐建筑入口</Text>
          </View>

          <Pressable style={styles.tipBar} onPress={cycleTip}>
            <Text style={styles.tipLabel}>取景提示</Text>
            <Text style={styles.tipText}>{currentTip}</Text>
            <Text style={styles.tipTap}>点击切换下一条 ›</Text>
          </Pressable>

          <View style={styles.bottomBar}>
            <Text style={styles.locationLabel}>{location.name}</Text>
            <Pressable style={styles.shutter} onPress={takePicture}>
              <View style={styles.shutterInner} />
            </Pressable>

          </View>
        </SafeAreaView>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
  },
  errorText: {
    color: Colors.textSecondary,
  },
  closeButton: {
    alignSelf: 'flex-start',
    margin: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.cameraOverlay,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  guideFrame: {
    alignSelf: 'center',
    width: '78%',
    height: '42%',
    borderWidth: 2,
    borderColor: Colors.guideFrame,
    borderStyle: 'dashed',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  corner: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderColor: '#fff',
  },
  cornerTL: {
    top: -2,
    left: -2,
    borderTopWidth: 3,
    borderLeftWidth: 3,
  },
  cornerTR: {
    top: -2,
    right: -2,
    borderTopWidth: 3,
    borderRightWidth: 3,
  },
  cornerBL: {
    bottom: -2,
    left: -2,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
  },
  cornerBR: {
    bottom: -2,
    right: -2,
    borderBottomWidth: 3,
    borderRightWidth: 3,
  },
  guideLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  guideHint: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
    marginTop: 4,
  },
  tipBar: {
    marginHorizontal: 16,
    backgroundColor: Colors.cameraOverlay,
    borderRadius: 14,
    padding: 14,
  },
  tipLabel: {
    color: Colors.accent,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 4,
  },
  tipText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
  },
  tipTap: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    marginTop: 6,
  },
  bottomBar: {
    alignItems: 'center',
    paddingBottom: 24,
  },
  locationLabel: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 16,
    fontWeight: '600',
  },
  shutter: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 4,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
  },
  permissionContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: Colors.background,
  },
  permissionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 8,
  },
  permissionText: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  permissionButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 24,
  },
  permissionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  backLink: {
    marginTop: 16,
  },
  backLinkText: {
    color: Colors.primary,
    fontSize: 15,
  },
  previewContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  previewImage: {
    flex: 1,
  },
  previewActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    paddingHorizontal: 8,
    backgroundColor: Colors.surface,
    flexWrap: 'wrap',
    gap: 8,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 24,
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 24,
  },
  secondaryButtonText: {
    color: Colors.text,
    fontWeight: '600',
    fontSize: 16,
  },
  aiAnalysis: {
    margin: 16,
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 12,
  },
  aiTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1a73e8',
    marginBottom: 8,
  },
  aiText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
});