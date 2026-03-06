# myblog

AI agent benchmark: build a full-stack personal blog from a single prompt.

`AGENTS.md` defines the requirements. An AI coding agent reads the file and builds the entire project in one shot. Each attempt lives on its own branch -- a "speedrun."

## Speedrun Rules

1. **Always branch from the initial commit on `main`.**

   ```bash
   git checkout main
   git checkout -b <agent>-speedrun
   ```

2. **One branch per attempt.** Name it after the model or agent (e.g. `sonnet-4.6-speedrun`, `gpt-5.3codex-speedrun`).

3. **Clean up between runs.** Speedrun branches leave behind generated files, build artifacts, Docker volumes, and other junk. Before starting a new run, reset the workspace:

   ```bash
   # switch back to main
   git checkout main

   # nuke untracked files and directories (including ignored ones)
   git clean -fdx

   # remove any leftover Docker resources from the previous run
   docker compose down -v --remove-orphans 2>/dev/null
   docker system prune -f 2>/dev/null
   ```

4. **Let the agent commit.** The agent is instructed to commit at logical checkpoints. Don't intervene.

## Existing Speedruns

| Branch | Agent |
|---|---|
| `sonnet-4.6-speedrun` | Claude Sonnet 4.6 |
| `speedrun-opus-4.6` | Claude Opus 4.6 |
| `haiku-4.5-speedrun` | Claude Haiku 4.5 |
| `gpt-5.3codex-speedrun` | GPT-5.3 Codex |

## Running the Blog

Every speedrun produces a Docker Compose stack. To try one:

```bash
git checkout <branch>
docker compose up --build
```

The app will be available at `http://localhost:3000`.
