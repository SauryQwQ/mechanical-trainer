(function () {
  const sourceFile = "手工整理-机器人与智能制造句子翻译";
  const items = [
    {
      en: "Because a digital twin links a real machine with a virtual model that can be updated by sensor data, engineers can test changes in the process before they disturb actual production.",
      cn: "由于数字孪生把真实机器与可由传感器数据实时更新的虚拟模型连接起来，工程师就能在改动真正影响生产之前，先对工艺变化进行测试。",
      pairs: [
        ["数字孪生", "digital twin"],
        ["连接", "links"],
        ["真实机器", "real machine"],
        ["虚拟模型", "virtual model"],
        ["传感器数据", "sensor data"],
        ["更新", "updated"],
        ["工程师", "engineers"],
        ["测试", "test"],
        ["工艺变化", "changes in the process"],
        ["影响", "disturb"],
        ["实际生产", "actual production"]
      ]
    },
    {
      en: "When a robot is sent into a place that is too hot, too dirty, or too dangerous for people, it can finish the task while reducing risk and keeping the work on schedule.",
      cn: "当机器人被派往对人来说过热、过脏或过于危险的环境时，它能够在降低风险的同时完成任务，并尽量保证工作按计划进行。",
      pairs: [
        ["机器人", "robot"],
        ["派往", "sent"],
        ["环境", "place"],
        ["过热", "too hot"],
        ["过脏", "too dirty"],
        ["危险", "dangerous"],
        ["完成任务", "finish the task"],
        ["降低风险", "reducing risk"],
        ["工作", "work"],
        ["按计划进行", "on schedule"]
      ]
    },
    {
      en: "Although collaborative robots usually handle lighter loads than large industrial robots, they are easier to set up and are often better for small batches and changing tasks.",
      cn: "尽管协作机器人通常承受的载荷小于大型工业机器人，但它们更容易部署，也往往更适合小批量和多变任务。",
      pairs: [
        ["协作机器人", "collaborative robots"],
        ["承受", "handle"],
        ["较轻载荷", "lighter loads"],
        ["大型工业机器人", "large industrial robots"],
        ["部署", "set up"],
        ["适合", "better for"],
        ["小批量", "small batches"],
        ["多变任务", "changing tasks"]
      ]
    },
    {
      en: "Since ROS provides software tools for drivers, motion planning, and perception, developers do not need to build every robot function from the beginning.",
      cn: "由于 ROS 提供了驱动、运动规划和感知等软件工具，开发者就不必从零开始构建机器人的每一项功能。",
      pairs: [
        ["ROS", "ROS"],
        ["提供", "provides"],
        ["软件工具", "software tools"],
        ["驱动", "drivers"],
        ["运动规划", "motion planning"],
        ["感知", "perception"],
        ["开发者", "developers"],
        ["构建", "build"],
        ["机器人功能", "robot function"],
        ["从零开始", "from the beginning"]
      ]
    },
    {
      en: "A robot mechanism is a multi-body system in which several rigid links are connected by joints, so its motion depends not only on each link itself but also on how the links are arranged.",
      cn: "机器人机构是一个多体系统，其中多个刚性构件通过关节连接，因此它的运动不仅取决于各个构件本身，还取决于这些构件的布置方式。",
      pairs: [
        ["机器人机构", "robot mechanism"],
        ["多体系统", "multi-body system"],
        ["刚性构件", "rigid links"],
        ["连接", "connected"],
        ["关节", "joints"],
        ["运动", "motion"],
        ["取决于", "depends on"],
        ["构件", "link"],
        ["布置方式", "arranged"]
      ]
    },
    {
      en: "If the controller compares the desired motion with the measured motion and then changes the motor input, the robot can reduce error even when the load or the path changes.",
      cn: "如果控制器把期望运动与实际测得的运动进行比较，再据此调整电机输入，那么即使载荷或路径发生变化，机器人也能减小误差。",
      pairs: [
        ["控制器", "controller"],
        ["比较", "compares"],
        ["期望运动", "desired motion"],
        ["测得的运动", "measured motion"],
        ["调整", "changes"],
        ["电机输入", "motor input"],
        ["机器人", "robot"],
        ["减小误差", "reduce error"],
        ["载荷", "load"],
        ["路径", "path"]
      ]
    },
    {
      en: "Finite element analysis divides a complex part into many small elements, which makes it possible to study stress, heat, and deformation in a structure that is too hard to solve by hand.",
      cn: "有限元分析把复杂零件划分成许多小单元，这使得研究那些难以手工求解结构中的应力、热量和变形成了可能。",
      pairs: [
        ["有限元分析", "Finite element analysis"],
        ["划分", "divides"],
        ["复杂零件", "complex part"],
        ["小单元", "small elements"],
        ["研究", "study"],
        ["应力", "stress"],
        ["热量", "heat"],
        ["变形", "deformation"],
        ["结构", "structure"],
        ["手工求解", "solve by hand"]
      ]
    },
    {
      en: "Even when the model, material, and loads are all reasonable, a poor mesh may still give weak results because the geometry and stress gradient are not captured well enough.",
      cn: "即使模型、材料和载荷设置都合理，糟糕的网格仍可能导致结果不可靠，因为几何特征和应力梯度没有被充分捕捉。",
      pairs: [
        ["模型", "model"],
        ["材料", "material"],
        ["载荷", "loads"],
        ["合理", "reasonable"],
        ["糟糕的网格", "poor mesh"],
        ["导致", "give"],
        ["不可靠结果", "weak results"],
        ["几何特征", "geometry"],
        ["应力梯度", "stress gradient"],
        ["捕捉", "captured"]
      ]
    },
    {
      en: "Since lubrication reduces friction and wear between moving surfaces, bearing life can drop quickly when oil supply is poor or when the oil film cannot be kept under slow or uneven motion.",
      cn: "由于润滑能够减少运动表面之间的摩擦和磨损，当供油不足或在低速、非均匀运动下无法保持油膜时，轴承寿命就可能迅速下降。",
      pairs: [
        ["润滑", "lubrication"],
        ["减少", "reduces"],
        ["摩擦", "friction"],
        ["磨损", "wear"],
        ["运动表面", "moving surfaces"],
        ["轴承寿命", "bearing life"],
        ["下降", "drop"],
        ["供油", "oil supply"],
        ["油膜", "oil film"],
        ["低速", "slow"],
        ["非均匀运动", "uneven motion"]
      ]
    },
    {
      en: "Condition monitoring is most valuable when it finds damage early enough for maintenance, because once a bearing begins to spall, the end of its useful life may already be close.",
      cn: "状态监测最有价值的地方在于能及早发现损伤以便维修，因为一旦轴承开始剥落，它的剩余可用寿命往往已经不长了。",
      pairs: [
        ["状态监测", "Condition monitoring"],
        ["有价值", "valuable"],
        ["发现损伤", "finds damage"],
        ["维修", "maintenance"],
        ["轴承", "bearing"],
        ["开始剥落", "begins to spall"],
        ["剩余可用寿命", "useful life"],
        ["接近终点", "end"]
      ]
    },
    {
      en: "In a manufacturing system, a digital twin can help engineers observe, diagnose, predict, and improve performance in near real time, which makes planning and adjustment more efficient.",
      cn: "在制造系统中，数字孪生能够帮助工程师近实时地观察、诊断、预测并改进系统性能，从而提高规划和调整的效率。",
      pairs: [
        ["制造系统", "manufacturing system"],
        ["数字孪生", "digital twin"],
        ["帮助", "help"],
        ["工程师", "engineers"],
        ["观察", "observe"],
        ["诊断", "diagnose"],
        ["预测", "predict"],
        ["改进性能", "improve performance"],
        ["近实时", "near real time"],
        ["规划", "planning"],
        ["调整", "adjustment"]
      ]
    },
    {
      en: "Although modern robot systems depend heavily on software, their real performance still depends on hardware choices such as actuators, drives, sensors, and transmission.",
      cn: "尽管现代机器人系统高度依赖软件，但它们的实际性能仍然取决于执行器、驱动、传感器和传动等硬件选择。",
      pairs: [
        ["现代机器人系统", "modern robot systems"],
        ["依赖", "depend"],
        ["软件", "software"],
        ["实际性能", "real performance"],
        ["取决于", "depends on"],
        ["硬件选择", "hardware choices"],
        ["执行器", "actuators"],
        ["驱动", "drives"],
        ["传感器", "sensors"],
        ["传动", "transmission"]
      ]
    },
    {
      en: "Because integrated automation links robots with machine and factory systems, companies can respond more flexibly when product demand, line speed, or task order changes.",
      cn: "由于集成自动化把机器人与机器及工厂系统连接起来，当产品需求、产线速度或任务顺序发生变化时，企业就能更灵活地应对。",
      pairs: [
        ["集成自动化", "integrated automation"],
        ["连接", "links"],
        ["机器人", "robots"],
        ["机器", "machine"],
        ["工厂系统", "factory systems"],
        ["企业", "companies"],
        ["应对", "respond"],
        ["灵活", "flexibly"],
        ["产品需求", "product demand"],
        ["产线速度", "line speed"],
        ["任务顺序", "task order"]
      ]
    },
    {
      en: "When simulation, testing, and verification are done in a virtual environment before the real line is built, companies can improve quality and shorten the design cycle.",
      cn: "当仿真、测试和验证在真实产线建成之前就先在虚拟环境中完成时，企业就可以提高质量并缩短设计周期。",
      pairs: [
        ["仿真", "simulation"],
        ["测试", "testing"],
        ["验证", "verification"],
        ["完成", "done"],
        ["虚拟环境", "virtual environment"],
        ["真实产线", "real line"],
        ["建成", "built"],
        ["企业", "companies"],
        ["提高质量", "improve quality"],
        ["缩短", "shorten"],
        ["设计周期", "design cycle"]
      ]
    },
    {
      en: "A collaborative robot that works directly beside people still needs proper sensors, control limits, and task planning, because safe cooperation depends on both hardware and system design.",
      cn: "即使协作机器人直接在人旁边工作，它仍然需要合适的传感器、控制限制和任务规划，因为安全协作既取决于硬件，也取决于系统设计。",
      pairs: [
        ["协作机器人", "collaborative robot"],
        ["工作", "works"],
        ["人旁边", "beside people"],
        ["需要", "needs"],
        ["传感器", "sensors"],
        ["控制限制", "control limits"],
        ["任务规划", "task planning"],
        ["安全协作", "safe cooperation"],
        ["取决于", "depends on"],
        ["硬件", "hardware"],
        ["系统设计", "system design"]
      ]
    },
    {
      en: "If a plain bearing contains solid lubricant in its material, it can keep reducing friction without frequent relubrication, which is useful in machines that run for long periods.",
      cn: "如果滑动轴承材料内部含有固体润滑剂，它就能在不频繁补充润滑的情况下持续减小摩擦，这对长时间运行的机械尤其有用。",
      pairs: [
        ["滑动轴承", "plain bearing"],
        ["含有", "contains"],
        ["固体润滑剂", "solid lubricant"],
        ["材料", "material"],
        ["持续减小", "keep reducing"],
        ["摩擦", "friction"],
        ["频繁补充润滑", "frequent relubrication"],
        ["机械", "machines"],
        ["运行", "run"],
        ["长时间", "long periods"]
      ]
    },
    {
      en: "When several sensors are used together in robot motion planning, the tool can avoid collisions more reliably because the controller has a better view of the surface and the nearby space.",
      cn: "当多个传感器被共同用于机器人运动规划时，工具就能更可靠地避免碰撞，因为控制器对工件表面和周围空间有了更全面的感知。",
      pairs: [
        ["传感器", "sensors"],
        ["共同使用", "used together"],
        ["机器人运动规划", "robot motion planning"],
        ["工具", "tool"],
        ["避免碰撞", "avoid collisions"],
        ["可靠地", "reliably"],
        ["控制器", "controller"],
        ["感知", "view"],
        ["表面", "surface"],
        ["周围空间", "nearby space"]
      ]
    },
    {
      en: "Advanced motion planning is important in smart manufacturing, because the robot must move safely and efficiently while it assembles, packages, or handles parts in a changing work area.",
      cn: "先进的运动规划在智能制造中很重要，因为机器人在不断变化的工作区域内进行装配、包装或搬运零件时，必须兼顾安全和效率。",
      pairs: [
        ["先进的运动规划", "Advanced motion planning"],
        ["重要", "important"],
        ["智能制造", "smart manufacturing"],
        ["机器人", "robot"],
        ["运动", "move"],
        ["安全", "safely"],
        ["高效", "efficiently"],
        ["装配", "assembles"],
        ["包装", "packages"],
        ["搬运零件", "handles parts"],
        ["工作区域", "work area"]
      ]
    },
    {
      en: "Since digital twins bring together mechanics, electronics, software, and process data in one model, engineers can find problems much earlier than they could with separate tools.",
      cn: "由于数字孪生把机械、电子、软件和过程数据整合到同一个模型中，工程师就能比使用分散工具时更早发现问题。",
      pairs: [
        ["数字孪生", "digital twins"],
        ["整合", "bring together"],
        ["机械", "mechanics"],
        ["电子", "electronics"],
        ["软件", "software"],
        ["过程数据", "process data"],
        ["模型", "model"],
        ["工程师", "engineers"],
        ["发现问题", "find problems"],
        ["分散工具", "separate tools"]
      ]
    },
    {
      en: "Although autonomous robots can make warehouse work faster by moving carts and equipment on their own, people are still needed for loading, unloading, and overall supervision.",
      cn: "尽管自主机器人能够通过自行搬运小车和设备来加快仓储作业，但在装载、卸载和整体监管方面仍然离不开人。",
      pairs: [
        ["自主机器人", "autonomous robots"],
        ["加快", "make faster"],
        ["仓储作业", "warehouse work"],
        ["搬运", "moving"],
        ["小车", "carts"],
        ["设备", "equipment"],
        ["人", "people"],
        ["需要", "needed"],
        ["装载", "loading"],
        ["卸载", "unloading"],
        ["整体监管", "overall supervision"]
      ]
    }
  ];

  const bank = (window.SENTENCE_TRANSLATION_BANK = Array.isArray(window.SENTENCE_TRANSLATION_BANK)
    ? window.SENTENCE_TRANSLATION_BANK
    : []);
  const startId = bank.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0) + 1;

  items.forEach((item, index) => {
    const sourceNumber = 41 + index;
    const common = {
      sourceFile,
      sourceNumber,
      deck: "英文翻译",
      group: "英文翻译",
      chapter: "机器人与智能制造句子翻译",
      priority: "句子翻译"
    };
    bank.push({
      ...common,
      id: startId + index * 2,
      subject: "英译中",
      question: item.en,
      answer: item.cn,
      translationDirection: "英译中",
      alignment: item.pairs.map(([right, left]) => ({ left, right }))
    });
    bank.push({
      ...common,
      id: startId + index * 2 + 1,
      subject: "中译英",
      question: item.cn,
      answer: item.en,
      translationDirection: "中译英",
      alignment: item.pairs.map(([left, right]) => ({ left, right }))
    });
  });
})();
