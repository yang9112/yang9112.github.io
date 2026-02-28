# Agent.md — 仓库文档与数据上传规范（Repository Agent Rules）

## 1. 目的（Purpose）

本规范用于约束 **Agent / 自动化工具 / 开发者** 在向 GitHub 仓库提交内容时的行为，确保：

* ✅ 仓库仅包含必要且可复现的项目资产
* ✅ 避免上传无效、临时或冗余文件
* ✅ 防止敏感信息与隐私泄露
* ✅ 保持仓库结构长期可维护与专业化

适用于：

* AI Agent 自动提交
* CI/CD 自动生成文件
* 开发者手动提交
* 脚本生成 PR

---

## 2. 上传内容的基本原则（Golden Rules）

### Rule 1 — 最小必要原则（Minimal Repository Principle）

仅上传 **运行项目、构建项目、理解项目** 必需的文件。

任何满足以下条件的内容 **禁止上传**：

* 可自动重新生成
* 本地临时产物
* 调试中间结果
* 与项目功能无直接关系

---

### Rule 2 — 可复现性优先（Reproducibility First）

仓库应满足：

> `git clone → install → build → run` 可完整复现。

允许上传：

* 源代码
* 配置模板
* 必要文档
* 构建脚本

禁止上传：

* 构建结果
* 本地环境状态
* 机器相关缓存

---

### Rule 3 — 默认视为公开（Public-by-default）

Agent 必须假设：

> 所有上传内容将永久公开。

因此禁止提交任何：

* 私有信息
* 内部路径
* Token
* 内网地址
* 身份信息

---

## 3. 严禁上传内容（DENY LIST）

### 3.1 本地环境与缓存文件

```
node_modules/
.dist/
build/
.cache/
.tmp/
.DS_Store
*.log
*.pid
coverage/
```

禁止原因：

* 可重新生成
* 污染仓库历史
* 无协作价值

---

### 3.2 自动生成产物（除非明确要求）

```
*.min.js
*.bundle.js
*.map
generated/*
dist-assets/*
```

例外：

* GitHub Pages 静态站点发布分支（如 gh-pages）

---

### 3.3 调试与临时文件（高频误上传）

```
test.txt
debug.md
temp.md
draft.md
notes-private.md
cicd-test.txt
```

Agent 必须识别关键词：

| 关键词    | 默认行为 |
| ------ | ---- |
| test   | 禁止   |
| tmp    | 禁止   |
| draft  | 禁止   |
| local  | 禁止   |
| backup | 禁止   |

---

### 3.4 CI/CD 中间文档（常见问题）

以下文件仅允许存在于 `.github/` 或 `/docs/process/`：

```
PR-CI-CD-FIX.md
PR-Complete-Instructions.md
MODERNIZATION-PR.md
```

否则视为：

❌ Agent 过程泄露。

---

### 3.5 敏感信息（绝对禁止）

Agent 必须扫描并阻止包含：

#### 凭证类

```
API_KEY
TOKEN
SECRET
PASSWORD
PRIVATE_KEY
```

#### 配置类

```
.env
.env.local
config.private.json
credentials.json
```

#### 内网信息

```
10.x.x.x
172.16.x.x
192.168.x.x
internal.company
```

---

## 4. 文档上传规范（Docs Policy）

### ✅ 允许上传

```
README.md
CHANGELOG.md
CONTRIBUTING.md
docs/
```

内容要求：

* 面向用户或开发者
* 非个人记录
* 非操作日志

---

### ❌ 不允许作为正式文档

以下属于 **Agent工作痕迹**：

* PR执行步骤
* AI推理过程
* 自动修复记录
* 临时整改说明

应改为：

```
/docs/architecture/
/docs/design/
/docs/user-guide/
```

---

## 5. Agent 提交前检查（Mandatory Pre-Commit Check）

Agent 在提交前必须执行：

### Step 1 — 文件分类判断

```
IsRequiredForRun?
IsHumanDocumentation?
IsReproducible?
ContainsSensitiveInfo?
```

若任一为否 → 拒绝提交。

---

### Step 2 — 敏感扫描

必须执行检测：

* Secret pattern scan
* Email detection
* Absolute path detection
* Token entropy detection

发现风险：

```
BLOCK COMMIT
```

---

### Step 3 — PR 内容限制

单次 PR 不应包含：

* > 20% 文档噪声文件
* 自动生成说明文档
* 无代码改动的技术性流水记录

---

## 6. Agent 行为约束（Agent Behavioral Rules）

Agent MUST NOT：

* 上传自身执行日志
* 上传推理中间结果
* 上传任务规划文件
* 上传“修复过程记录”

Agent SHOULD：

* 合并重复文档
* 删除历史噪声文件
* 优先修改已有文档

---

## 7. 自动拒绝策略（Auto-Reject Conditions）

出现以下情况直接拒绝 PR：

| 条件               | 处理     |
| ---------------- | ------ |
| 出现 `.env`        | Reject |
| 含 Token 字符串      | Reject |
| >50% 文件为 md 操作记录 | Reject |
| 上传 test/debug 文件 | Reject |
| 含本地路径            | Reject |

---

## 8. 提交信息规范（Commit Message Rule）

禁止：

```
fix stuff
update files
test commit
```

必须：

```
type(scope): concise change description
```

示例：

```
fix(ci): resolve github actions v4 deprecation
docs(architecture): add deployment model
```

---

## 9. Agent 自检清单（Checklist）

提交前 Agent 必须确认：

* [ ] 无敏感信息
* [ ] 无临时文件
* [ ] 无本地缓存
* [ ] 无执行日志
* [ ] 文件对最终用户有价值
* [ ] 仓库结构未污染

---

## 10. 一句话原则（TL;DR）

> **仓库保存的是产品，而不是开发过程。**

---

**Version:** 1.0
**Applies to:** Human + AI Agents + CI Systems
