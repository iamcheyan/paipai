# AI Workflow & Collaboration Rules for 拍拍 Hackathon Project

## Core Principle
This project uses the "扔文件夹" (drop folder) handoff method. Any AI (Grok, Claude, Qoder, Cursor, etc.) that receives the entire `paipai-hackathon` folder should be able to quickly bootstrap context by reading only a few files at the root.

## Standard Handoff Process (for any new AI session)
1. Receive the project folder path.
2. `list_dir` the root to see structure.
3. Immediately read (in priority order):
   - `HOW_TO_CONTINUE.md` (most important for current task state)
   - `PROJECT_CONTEXT.md`
   - `AI_WORKFLOW.md` (this file)
   - `README.md`
4. Summarize your understanding back to the user.
5. Only then ask for the specific next action.

Never ask the user to repeat background that is already in these documents.

## Document Writing Rules (for all future updates)
- All important decisions, status, and context go into root-level .md files.
- Use clear sections: Current Status, Decisions, Next Steps, For Future AIs.
- Update `HOW_TO_CONTINUE.md` and `PROJECT_CONTEXT.md` after every meaningful change.
- Keep documents concise but self-contained.
- Use Chinese for human-facing content when appropriate, English for technical consistency if needed.
- Do not bury critical info deep in subfolders.

## Multi-AI Collaboration
- Grok (this session): Good for research, file operations, quick prototyping, summarizing status.
- Qoder / Claude Code: Better for long-horizon planning, deep code changes, architecture.
- Use parallel when helpful (e.g., one AI researches, another codes).

## Tools & Environment
- Work only inside this folder.
- Prefer creating/updating the standard handoff documents.
- For demo: use `demo/` folder for mockups, videos, fake data, presentation materials.
- For code: even if partial, put in `src/`.

## Reference
This workflow is modeled directly after the successful MultiChat Chrome extension handoff process (see that project's HOW_TO_CONTINUE.md and CHROME_STORE_REVIEW.md for the exact pattern).

Update this file only when collaboration rules evolve.