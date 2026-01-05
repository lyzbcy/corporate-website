---
title: Pose Drive (AI 姿态驱动系统)
subtitle: 基于普通摄像头的无穿戴 VR 交互方案
image: 
alt: Pose Drive 演示
category: tool
featured: true

caption:
  title: Pose Drive
  subtitle: AI Motion Capture for VR
  thumbnail: 
---

<div class="q-bounce-content" markdown="1">

## 3. Pose Drive (AI 姿态驱动系统)

### 📋 功能简介
**Pose Drive** 是一个基于普通摄像头的 AI 体感输入系统。它突破了硬件限制，允许开发者在**没有 VR 头显和手柄**的情况下，仅通过 PC/Mac 摄像头捕捉身体和手部动作，直接驱动 VR 场景中的交互逻辑。

### 💻 技术点
- **端侧 AI 推理**: 集成 **Unity Barracuda** 推理引擎，直接在本地运行 Google **MoveNet** 轻量级姿态估计模型，实现低延迟的离线推理，无需联网。
- **虚拟输入映射**: 封装了一套虚拟 Input System，将 AI 识别到的头部旋转、身体移动、手势动作（如挥手、抓取）实时映射为标准的 Unity Input 信号。
- **动作分类器**: 内置基于关键点的动作分类器（Action Classifier），支持识别特定的交互手势，提升交互的准确性。

### 💡 创新点
- **硬件解耦**: 打破了 VR 开发必须依赖昂贵硬件的限制，让开发者随时随地（甚至在咖啡厅）都能调试 VR 交互逻辑。
- **交互民主化**: 为失语症治疗等康复场景提供了非穿戴式的交互方案，患者无需佩戴沉重的设备即可轻松通过肢体动作参与康复训练。

</div>