/* Figura: English / 中文 for the interface.
   The app writes its interface in English; in Chinese mode a watcher translates text and tooltips as they appear,
   by whole phrases (also "phrase (key)" and "a · b" pieces). The drawing itself, code, maths and page names are never touched. */
(() => {
  const LS = 'figura-lang-v1';
  let lang = 'en';
  try { lang = localStorage.getItem(LS) || (/^zh/i.test(navigator.language || '') ? 'zh' : 'en'); } catch { lang = /^zh/i.test(navigator.language || '') ? 'zh' : 'en'; }
  document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';

  const ZH = {
    // top bar, pages, view
    'Help': '帮助', 'Guide': '指南', 'Shortcuts': '快捷键', 'Settings': '设置', 'Export': '导出', 'Import': '导入', 'Page': '页面', 'New page': '新建页面',
    'Duplicate page': '复制页面', 'Delete page': '删除页面', 'Rename': '重命名', 'Rename a page': '重命名页面', 'Export all pages': '导出所有页面', 'Export this page': '导出当前页面',
    'Export page (.figura)': '导出页面 (.figura)', 'Import… (.figura, .tex, .figtool)': '导入…（.figura、.tex、.figtool）', 'Pages: new, import, export': '页面：新建、导入、导出',
    'Double-click to rename · right-click for more': '双击重命名 · 右键查看更多', 'Lock page': '锁定页面', 'Unlock page': '解锁页面', 'Lock this page': '锁定此页', 'Unlock this page': '解锁此页',
    'Lock / unlock the page': '锁定 / 解锁页面', 'Page locked: view only': '页面已锁定：仅查看', 'Page unlocked': '页面已解锁', 'This page is locked — press K to unlock': '此页已锁定，按 K 解锁',
    'Unlock the page first': '请先解锁页面', 'Grid': '网格', 'Dot grid': '点阵网格', 'Half grid: dots half way too': '半格：中间也有点', 'Free placement': '自由放置', 'Grid: dots → half → free': '网格：点阵 → 半格 → 自由',
    'Zoom': '缩放', 'Zoom in': '放大', 'Zoom out': '缩小', 'Reset to 100%': '重置为 100%', 'Fit everything': '显示全部', 'Undo': '撤销', 'Redo': '重做', 'One step back': '后退一步',
    'Show map': '显示小地图', 'Hide map': '隐藏小地图', 'Draw anything': '随手画', 'Pick a shape below and click, or drag a box ·': '在下方选一个图形后点击，或拖出一个框 ·',
    'to connect · double-click to write': '连线 · 双击输入文字', 'Tip: press ? for every shortcut': '提示：按 ? 查看所有快捷键', 'Move the toolbar': '移动工具栏',
    'Drag to move the toolbar · double-click to switch side': '拖动以移动工具栏 · 双击切换位置', 'Full guide': '完整指南', 'Language': '语言',
    // tools
    'Tools': '工具', 'Select': '选择', 'Hand': '抓手', 'Circle': '圆', 'Box': '矩形', 'Triangle': '三角形', 'Diamond': '菱形', 'Dot': '点', 'Text': '文字', 'Connector': '连线',
    'Compass': '圆规', 'Image': '图片', 'Laser pointer': '激光笔', 'Logic gate': '逻辑门', 'Gate': '门', 'Select / move · again: box ↔ lasso': '选择 / 移动 · 再按：框选 ↔ 套索',
    'Hand (or hold Space)': '抓手（或按住空格）', 'Dot · hold with shapes selected: parallel lines': '点 · 选中图形时按住：平行连线', 'Text (or double-click the canvas)': '文字（或双击画布）',
    'Connector · again: line style': '连线 · 再按：线型', 'Picture (or paste / drop one)': '图片（或粘贴 / 拖入）', 'Compass: centre, then a point on the circle': '圆规：先圆心，再圆上一点',
    'Logic gate (AND, OR, NOT, NAND, NOR, XOR …)': '逻辑门（与、或、非、与非、或非、异或…）', 'Box select (V)': '框选 (V)', 'Lasso (V again)': '套索（再按 V）', 'Box / lasso': '框选 / 套索',
    'Dot: a glowing pointer': '点：发光指示点', 'Line: a fading trail': '线：渐隐轨迹', 'Mode': '模式', 'Inverted input': '反相输入', 'Buffer': '缓冲器',
    // shape / line styling
    'Fill': '填充', 'No fill': '无填充', 'Border': '边框', 'Border: colour, width, style, double': '边框：颜色、粗细、样式、双线', 'Border: none, colour, width, dashes': '边框：无、颜色、粗细、虚线',
    'Double border': '双线边框', 'Rounded corners': '圆角', 'Corner radius': '圆角半径', 'Less round': '减小圆角', 'More round': '增大圆角', 'Corners': '圆角', 'Direction': '方向', 'Proportions': '比例',
    'Square': '正方', 'Wide': '宽', 'Tall': '高', 'Square diamond (equal sides)': '正菱形（等边）', 'Points up': '朝上', 'Points down': '朝下', 'Points left': '朝左', 'Points right': '朝右',
    'Shape': '形状', 'Shape: kind, direction, corners': '形状：种类、方向、圆角', 'Text only': '仅文字', 'Fit to text': '适应文字', 'Colour': '颜色', 'Colours': '颜色', 'Text colour': '文字颜色', 'Line colour': '线条颜色',
    'Size': '大小', 'Larger': '放大', 'Smaller': '缩小', 'Bold': '粗体', 'Italic': '斜体', 'Underline': '下划线', 'Bold, italic, underline': '粗体、斜体、下划线', 'Bold · italic · underline': '粗体 · 斜体 · 下划线',
    'Vertical': '竖排', 'Vertical text': '竖排文字', 'Horizontal text': '横排文字', 'Text size and style': '文字大小和样式', 'Line style': '线型', 'Solid': '实线', 'Dashed': '虚线', 'Dotted': '点线', 'Dash': '虚线',
    'Plain line': '普通线', 'Double line': '双线', 'Wavy': '波浪线', 'Zigzag': '折线', 'Arrow heads': '箭头', 'Arrow': '箭头', 'Both ways': '双向', 'Filled arrow': '实心箭头', 'Open triangle': '空心三角',
    'Open triangle (inheritance)': '空心三角（继承）', 'Filled triangle': '实心三角', 'From a dot': '从点出发', 'Double head': '双箭头', 'Hook': '钩', 'Bar': '竖线', 'None': '无', 'Start': '起点', 'End': '终点',
    'Start and end heads': '起点和终点箭头', 'more arrow heads': '更多箭头', 'Ray': '射线', 'Ray (runs on and fades)': '射线（延伸并渐隐）', 'Line (runs on both ways)': '直线（两端延伸）',
    'Ray: runs on one grid step and fades': '射线：延伸一格并渐隐', 'Reverse direction': '反转方向', 'Straighten': '拉直', 'Path': '路径', 'Arc: drag the middle to bend': '弧线：拖动中点弯曲',
    'Bézier: two handles': '贝塞尔：两个控制点', 'Label (double-click the line)': '标签（双击连线）', 'Above': '上方', 'Below': '下方', 'Left': '左', 'Right': '右', 'On the line': '线上',
    'Ports': '端口', 'Ports spread evenly': '端口均匀分布', 'Ports packed to both ends': '端口靠两端', 'All into the middle': '全部汇于中点', 'Lines meet': '连线交汇方式',
    'Along the line: meets the circle where it points': '沿线：在指向处与圆相交', 'Line ends on shapes': '线端落在图形上', 'Add a label outside · drag it round the shape': '在外侧添加标签 · 可拖着绕图形移动',
    'No border · pick a style to add one': '无边框 · 选一种样式即可添加', 'No border · pick a width or style to add one': '无边框 · 选粗细或样式即可添加', 'Gap': '间距', 'Wire': '连线',
    // colours and picker
    'Ink': '墨色', 'Any colour': '任意颜色', 'Add to quick colours': '添加到常用颜色', 'Keep in quick colours': '保留到常用颜色', 'Change colour…': '更改颜色…', 'Move left': '左移', 'Move right': '右移',
    'Remove': '移除', 'Reset': '重置', 'Reset quick colours': '重置常用颜色', 'Replace': '替换', 'Use current colour': '使用当前颜色', 'Pick from screen': '从屏幕取色', 'Before (click to go back) / after': '之前（点击恢复）/ 之后',
    'Wheel': '色轮', 'Sliders': '滑块', 'Hex': '十六进制', 'Add': '添加', 'Add a preset': '添加预设', 'Keep as a preset': '保留为预设', 'Delete preset': '删除预设', 'custom colour': '自定义颜色',
    'Red': '红', 'Orange': '橙', 'Amber': '琥珀', 'Lime': '青柠', 'Green': '绿', 'Teal': '蓝绿', 'Cyan': '青', 'Blue': '蓝', 'Violet': '紫', 'Pink': '粉', 'Grey': '灰', 'Slate': '石板灰',
    'Mono': '单色', 'Pastel': '粉彩', 'Soft': '柔和', 'Vivid': '鲜艳', 'Deep': '深色', 'Light': '浅', 'Dark': '深',
    // selection bar / menus / edit
    'Duplicate': '复制', 'Delete': '删除', 'More': '更多', 'Copy': '复制', 'Paste': '粘贴', 'Cut': '剪切', 'Select all': '全选', 'Add text': '添加文字', 'Insert picture': '插入图片', 'Insert picture…': '插入图片…',
    'Align and space': '对齐与分布', 'Align left': '左对齐', 'Align centre': '水平居中', 'Align right': '右对齐', 'Align top': '顶对齐', 'Align middle': '垂直居中', 'Align bottom': '底对齐',
    'Space evenly': '均匀分布', 'Layers': '图层', 'Bring to front': '置于顶层', 'Bring forward': '上移一层', 'Send backward': '下移一层', 'Send to back': '置于底层', 'Reset rotation': '重置旋转',
    'Rotate +15°': '旋转 +15°', 'Rotate −15°': '旋转 −15°', 'Swap two selected shapes': '交换两个选中的图形', 'Crop / move picture': '裁剪 / 移动图片', 'Crop / move the picture (double-click)': '裁剪 / 移动图片（双击）',
    'Put a picture inside': '在里面放一张图片', 'Replace picture': '替换图片', 'Replace the picture inside': '替换里面的图片', 'Remove picture': '移除图片', 'Write / label': '书写 / 标注',
    'Drag to move the picture · handles to crop · Enter to finish': '拖动移动图片 · 拖手柄裁剪 · 回车完成', 'Add to toolbar': '添加到工具栏', 'Copy its contents': '复制其内容',
    'Copied': '已复制', 'Could not copy': '无法复制', 'Clipboard not available here': '此处无法使用剪贴板', 'Paste or drop': '粘贴或拖入',
    // settings
    'Magnetic snapping': '磁性吸附', 'Snap to grid and shapes': '吸附到网格和图形', 'Name new points': '自动命名新点', 'A, B, C… on points you place or build': '为放置或作出的点标 A、B、C…',
    'Toolbar': '工具栏', 'Customize…': '自定义…', 'Customize toolbar…': '自定义工具栏…', 'Customize this menu…': '自定义此菜单…', 'Order, hide, own buttons': '排序、隐藏、自定义按钮',
    'Restore defaults': '恢复默认', 'Layouts, own buttons, menus, position': '布局、自定义按钮、菜单、位置', 'Quick colours, tool colours, recent': '常用颜色、工具颜色、最近使用',
    'Everything': '全部', 'Also widths, sizes, dashes, order, toolbar layouts': '还包括粗细、大小、虚线、排序、工具栏布局', 'Click again to reset everything': '再点一次重置全部', 'Clear page': '清空页面',
    'Page cleared — ': '页面已清空 — ', '⌘Z brings it back': '⌘Z 可撤销', 'Ctrl+Z brings it back': 'Ctrl+Z 可撤销', 'General': '通用', 'ZX-calculus': 'ZX 演算', 'Category theory': '范畴论', 'Geometry': '几何', 'Snap': '吸附', 'Leave': '保持不动',
    'Hide this button': '隐藏此按钮', 'Edit this button': '编辑此按钮', 'Add the selected look as a button': '把选中对象的样式添加为按钮', 'Toolbar layout added': '已添加工具栏布局',
    'Toolbar back to the default': '工具栏已恢复默认', 'New layout from this one': '以此新建布局', 'Delete this layout': '删除此布局', 'Export this layout (.figtool)': '导出此布局 (.figtool)',
    'Import a layout (.figtool)': '导入布局 (.figtool)', 'Separator': '分隔线', 'Selected look': '选中对象的样式', 'Layout': '布局', 'Options': '选项', 'Delete?': '删除？', 'Click again to delete': '再点一次删除',
    'This cannot become a button': '无法添加为按钮', 'No toolbar layout in this file': '此文件中没有工具栏布局', 'Object': '对象', 'Wire point': '连线点', 'Hadamard box': 'Hadamard 方框', 'Hadamard edge': 'Hadamard 边',
    'Z spider': 'Z 蜘蛛', 'X spider': 'X 蜘蛛', 'Equals': '等号', 'Segment': '线段', 'Line': '直线', 'Helper line (dashed)': '辅助线（虚线）',
    // export
    'TikZ': 'TikZ', 'File': '文件', 'Files': '文件', 'Whole page': '整页', 'Selection': '选中部分', 'This page': '当前页面', 'Download': '下载', 'Download figura.sty': '下载 figura.sty', 'Pictures': '图片',
    'Nothing to export': '没有可导出的内容', 'Nothing to export yet': '还没有可导出的内容', 'Image saved': '图片已保存', 'LaTeX copied': 'LaTeX 已复制', 'TikZ copied': 'TikZ 已复制', 'figura.sty copied': 'figura.sty 已复制',
    'Typesetting…': '排版中…', 'Imported from LaTeX': '已从 LaTeX 导入', 'Pasted from LaTeX': '已从 LaTeX 粘贴', 'Could not read this file': '无法读取此文件', 'Needs only': '只需要',
    'Only needs TikZ · paste or import it to edit again': '只需 TikZ · 粘贴或导入即可再次编辑', 'Shorter code (': '更短的代码（', 'Want shorter code?': '想要更短的代码？', 'White': '白色背景',
    'Math renderer unavailable offline — exporting as plain text': '离线时无法渲染公式，将导出为纯文本', 'Too large to autosave (big pictures) — save a .figura file': '内容太大无法自动保存（图片过大），请保存为 .figura 文件',
    'Open TikZ export': '打开 TikZ 导出', 'Open figura.sty export': '打开 figura.sty 导出', 'Open image export': '打开图片导出', 'Open file export': '打开文件导出',
    // help
    'Use in LaTeX': '在 LaTeX 中使用', 'Import & export': '导入与导出', 'Keys': '按键', 'Mouse & modifiers': '鼠标与修饰键', 'Load TikZ in the preamble': '在导言区加载 TikZ', 'Paste the picture': '粘贴图形',
    'Plain TikZ, nothing else to install. The result looks like the canvas.': '纯 TikZ，无需安装其他东西。结果与画布一致。',
    'Single keys. Every one can be changed in the Shortcuts tab — the cards follow your keys.': '单键操作。每个键都可在“快捷键”页修改，卡片会随之更新。',
    'Click a key to change it, then press the new key (Esc cancels). A key already in use swaps over.': '点击按键后按下新键即可修改（Esc 取消）。已被占用的键会互换。',
    'Reset to defaults': '恢复默认', 'Shortcuts back to the defaults': '快捷键已恢复默认', 'Press a key…': '请按一个键…', 'That key is reserved — try another': '这个键被保留了，换一个吧',
    'Click, then press a new key': '点击，然后按新键', 'Draw': '绘制', 'Connect': '连线', 'Construct': '作图', 'Transform': '变换', 'Measure': '度量', 'Edit': '编辑', 'View': '视图',
    'Select and move': '选择与移动', 'Hand / pan': '抓手 / 平移', 'Shapes': '图形', 'Dots': '点', 'Text and maths': '文字与公式', 'Curve types': '曲线类型', 'Connect many at once': '一次连接多个',
    'Parallel lines': '平行连线', 'Swap two shapes': '交换两个图形', 'Rotate by 15°': '旋转 15°', 'Constructions': '作图', 'Rays': '射线', 'Points on objects': '对象上的点', 'Measure and mark': '度量与标记',
    'In proportion': '等比例', 'From the centre': '从中心', 'Move while drawing': '边画边移动', 'Duplicate while moving': '移动时复制', 'Show wired neighbours': '显示相连的图形', 'Through several shapes': '穿过多个图形',
    'In proportion: square, circle, square diamond, equilateral triangle': '等比例：正方形、圆、正菱形、等边三角形', 'Draw or resize from the centre': '从中心绘制或缩放',
    'Move the shape while drawing it': '绘制时移动图形', 'Space while dragging': '拖动时按空格', 'Connect many to one (2+ selected, connector tool)': '多对一连线（选中 2 个以上，连线工具）',
    'Click the target': '点击目标', '…keep the sources for more targets': '…保留源以连接更多目标', 'Add / drop a source': '添加 / 移除一个源', 'Wire every shape a stroke passes': '连接一笔经过的所有图形',
    'Drag through': '拖动穿过', 'Box-select in the connector tool': '在连线工具中框选', 'Right-drag': '右键拖动', 'Line from two clicks (shapes or empty spots) · self-loop: the same shape twice': '点两下画线（图形或空白处）· 自环：同一图形点两次',
    'Click, click': '点两下', 'Bend / Bézier handles / elbow step': '弯曲 / 贝塞尔控制点 / 折线拐点', 'Drag the dots on a selected line': '拖动选中连线上的点',
    'Move a line end along a shape, onto another, or off it': '沿图形移动线端，移到另一个图形或移开', 'Drag its end dot': '拖动它的端点', 'Ports evenly · packed to the ends · in the middle': '端口均匀 · 靠两端 · 居中',
    'Right-click a shape': '右键点击图形', 'Add to the selection': '加入选择', 'Write in a shape / label a line': '在图形中书写 / 标注连线', 'Double-click · Enter': '双击 · 回车', 'Undo · redo': '撤销 · 重做',
    'Copy · paste · duplicate': '复制 · 粘贴 · 再制', 'Forward / backward · to front / back': '上移 / 下移 · 置顶 / 置底', 'Nudge · delete': '微移 · 删除', 'Export / open pages': '导出 / 打开页面',
    'Double-click its tab': '双击标签页', 'Drag its grip': '拖动把手', 'Help and shortcuts': '帮助与快捷键', 'Hold with shapes selected: connect them to what you click': '选中图形时按住：把它们连到点击的对象',
    'Point on a line / circle · at an intersection': '线 / 圆上的点 · 交点', 'Dot tool: click it': '点工具：点击它', 'Slide a point along its line or circle': '让点沿线或圆滑动', 'Drag it': '拖动它',
    'Every construction, transform and measurement for the selection': '当前选择可用的全部作图、变换和度量', 'Right-click · compass in the style bar': '右键 · 样式栏中的圆规',
    'A small filled point: click to place, sizes and colours in the bar. Lines snap to it like to any shape.': '小实心点：单击放置，大小和颜色在工具条中设置。连线会像吸附图形一样吸附到它。',
    'Click for the default size, or drag a box. The bar above the dock sets fill, border, direction (triangle), proportions (diamond) and corners.': '单击得到默认大小，或拖出一个框。工具栏上方的条可设置填充、边框、方向（三角形）、比例（菱形）和圆角。',
    'Drag from one shape to another, or click one and then the other. Dropping in empty space makes a new shape. Drag the middle dot to bend.': '从一个图形拖到另一个，或先后点击两个。拖到空白处会新建一个图形。拖动中点可弯曲。',
    'With a line selected: arc, Bézier (two handles), S-curve, elbow or rounded elbow. For new lines: ⋯ in the connector bar → Path.': '选中连线后：弧线、贝塞尔（两个控制点）、S 形、折线或圆角折线。新连线：连线工具条中的 ⋯ → 路径。',
    'Select exactly two shapes and press W: they trade places, lines follow.': '恰好选中两个图形后按 W：它们交换位置，连线跟随。',
    'Press on a centre (a shape, or any point) and drag to the circle, or click the centre and then a point. Built on shapes, the circle follows them when they move.': '在圆心（图形或任意点）按下并拖到圆上，或先点圆心再点一点。基于图形画的圆会随图形移动。',
    'With a line selected: the ray ends in the arrow row (or Start / End heads). The line runs one grid step past its last point and fades, in LaTeX too.': '选中连线后：在箭头行（或起点 / 终点箭头）中选射线端。线会越过最后一点延伸一格并渐隐，LaTeX 中也一样。',
    'For presenting: a glowing dot or a fading trail (pick in its bar).': '演示用：发光的点或渐隐的轨迹（在工具条中选择）。',
    'While drawing or resizing, the shape grows around its centre instead of from a corner.': '绘制或缩放时，图形从中心向外变化，而不是从角上。',
    'Drag a selected shape with Option / Alt held: a copy goes where you drop it.': '按住 Option / Alt 拖动选中的图形：在松手处放一个副本。',
    'In the connector tool, a stroke that runs through shapes connects them in that order.': '在连线工具中，一笔穿过多个图形会按顺序把它们连起来。',
    'Hold the right button and drag a box: those shapes become sources, then click a target. A plain right-click still opens the menu.': '按住右键拖出一个框：框中图形成为源，再点击目标。普通右键仍会打开菜单。',
    'With the Dot tool, click a line or circle: the point stays on it and slides along when dragged. Click where two of them cross: their intersection.': '用点工具点击线或圆：点会留在上面，拖动时沿着滑动。点击两者相交处：得到交点。',
    // geometry
    'Construct · transform · measure': '作图 · 变换 · 度量', 'Midpoint': '中点', 'Perpendicular bisector': '垂直平分线', 'Perpendicular line': '垂线', 'Parallel line': '平行线', 'Foot of the perpendicular': '垂足',
    'Intersection': '交点', 'Intersections': '交点', 'Centre point': '中心点', 'Point on the line': '线上的点', 'Point on the circle': '圆上的点', 'Segments': '线段', 'Angle bisector': '角平分线',
    'Circle by centre and point': '以圆心和一点作圆', 'Circle through 3 points': '过三点的圆', 'Arc on circle (centre first)': '圆上的弧（先选圆心）', 'Arc through 3 points': '过三点的弧',
    'Tangents from the point': '过点作切线', 'Polygon interior': '多边形内部', 'Make free (stop following)': '解除依赖（不再跟随）', 'Now free': '已解除依赖',
    'Mark as centre': '标记为中心', 'Unmark centre': '取消中心标记', 'Mark as mirror': '标记为镜面', 'Unmark mirror': '取消镜面标记', 'Mark vector (first → second)': '标记向量（第一个 → 第二个）',
    'Rotate…': '旋转…', 'Dilate…': '位似…', 'Reflect': '反射', 'Translate': '平移', 'Distance': '距离', 'Length': '长度', 'Slope': '斜率', 'Angle': '角度', 'Radius': '半径', 'Circumference': '周长',
    'Area': '面积', 'Perimeter': '周长', 'Coordinates': '坐标', 'Angle mark': '角标记', 'Right-angle mark': '直角标记', 'Name the point': '命名该点', 'Name the points': '命名这些点', 'Equal marks': '等长记号',
    'One': '一', 'Two': '二', 'Three': '三', 'One arc': '一条弧', 'Two arcs': '两条弧', 'Three arcs': '三条弧', 'Right angle': '直角', 'Apply (Enter)': '应用（回车）',
    'Built from other objects: move those and it follows': '由其他对象作出：移动它们，它会跟随', 'They do not meet here: it shows faint until they do': '它们在此不相交：相交前显示为淡色',
    'Mark a centre first: select a point → Mark as centre': '请先标记中心：选中一个点 → 标记为中心', 'Mark a mirror first: select a line → Mark as mirror': '请先标记镜面：选中一条线 → 标记为镜面',
    'Mark a vector first: select two points → Mark vector': '请先标记向量：选中两个点 → 标记向量',
    'Midpoint (a line, or two points)': '中点（一条线，或两个点）', 'Perpendicular line (a point and a line)': '垂线（一个点和一条线）', 'Perpendicular bisector (a line, or two points)': '垂直平分线（一条线，或两个点）',
    'Parallel line through a point': '过点作平行线', 'Intersection (lines / circles)': '交点（线 / 圆）', 'Reflect in the marked mirror (or the one selected line)': '关于标记的镜面（或选中的直线）反射',
    'Centre point of a shape': '图形的中心点', 'Segment (two points · 3+ points: closed)': '线段（两个点 · 3 个以上：闭合）', 'Ray (from the first point through the second)': '射线（从第一个点经过第二个点）',
    'Line (endless, through two points)': '直线（无限长，过两点）', 'Foot of the perpendicular (a point and a line)': '垂足（一个点和一条线）', 'Angle bisector (three points, vertex second)': '角平分线（三个点，顶点放第二个）',
    'Circle through three points': '过三点的圆', 'Arc on a circle (centre, start, end)': '圆上的弧（圆心、起点、终点）', 'Arc through three points': '过三点的弧', 'Tangents from a point to a circle': '过点作圆的切线',
    'Polygon interior (three or more points)': '多边形内部（三个或更多点）', 'Mark the selected point as centre': '把选中的点标记为中心', 'Mark the selected line as mirror': '把选中的线标记为镜面',
    'Mark a vector (two points)': '标记向量（两个点）', 'Rotate about the marked centre': '绕标记中心旋转', 'Dilate from the marked centre': '以标记中心位似', 'Translate by the marked vector': '按标记向量平移',
    'Distance (two points) · length (a line)': '距离（两个点）· 长度（一条线）', 'Angle (three points, vertex second)': '角度（三个点，顶点放第二个）', 'Angle mark (three points, vertex second)': '角标记（三个点，顶点放第二个）',
    'Centroid': '重心', 'Orthocentre': '垂心', 'Circumcentre': '外心', 'Incentre': '内心', 'Circumcircle': '外接圆', 'Midpoints of the sides': '各边中点',
    'AND': '与', 'NAND': '与非', 'OR': '或', 'NOR': '或非', 'XOR': '异或', 'XNOR': '同或', 'NOT': '非',
  };
  /* sentences with a number or a key in them */
  const PAT = [
    [/^Copied (\d+)$/, '已复制 $1 个'], [/^Added to “(.+)”$/, '已添加到“$1”'], [/^Select (.+) first$/, '请先选中$1'], [/^Hide “(.+)”$/, '隐藏“$1”'], [/^(\d+) objects are off the grid$/, '$1 个对象不在网格上'],
    [/^1 object is off the grid$/, '1 个对象不在网格上'], [/^All pages \((\d+)\)$/, '所有页面（$1）'], [/^(\d+) shapes · (\d+) lines$/, '$1 个图形 · $2 条线'],
  ];
  const SEL_WHAT = { 'a line, or two points': '一条线，或两个点', 'a point and a line': '一个点和一条线', 'two lines, two circles, or a line and a circle': '两条线、两个圆，或一条线和一个圆', 'one shape': '一个图形',
    'two or more points': '两个或更多点', 'two points': '两个点', 'a centre and a point': '圆心和一点', 'three points': '三个点', 'three points (centre first)': '三个点（先选圆心）',
    'three points (vertex second)': '三个点（顶点放第二个）', 'a point and a circle': '一个点和一个圆', 'three or more points': '三个或更多点', 'one point': '一个点', 'one line': '一条线',
    'two points or a line': '两个点或一条线', 'what it needs': '所需对象', 'what to turn (mark a centre first)': '要旋转的对象（先标记中心）', 'what to scale (mark a centre first)': '要位似的对象（先标记中心）',
    'what to reflect, and a line': '要反射的对象和一条线', 'what to move (mark a vector first)': '要平移的对象（先标记向量）' };

  function one(t) {
    if (ZH[t]) return ZH[t];
    for (const [re, to] of PAT) if (re.test(t)) { const m = t.match(re); if (re.source.startsWith('^Select (')) return SEL_WHAT[m[1]] ? '请先选中' + SEL_WHAT[m[1]] : null; return t.replace(re, to); }
    let m = /^(.*?)(\s*[(（][^()（）]*[)）])$/.exec(t);
    if (m && m[1] && ZH[m[1]]) { const inner = m[2].trim().slice(1, -1), ti = piece(inner); return ZH[m[1]] + '（' + ti + '）'; }
    m = /^(.*?)([:：…])$/.exec(t); if (m && ZH[m[1]]) return ZH[m[1]] + m[2];
    return null;
  }
  /* inside brackets: keys stay, known bits split on · and , are translated */
  const BITS = { 'again: box ↔ lasso': '再按：框选 ↔ 套索', 'again: line style': '再按：线型', 'or double-click the canvas': '或双击画布', 'or paste / drop one': '或粘贴 / 拖入',
    'hold with shapes selected: parallel lines': '选中图形时按住：平行连线', 'hold with shapes selected: connect': '选中图形时按住：连线', 'double-click': '双击', 'right-click': '右键', 'drag': '拖动' };
  function piece(t) {
    return t.split(' · ').map(a => a.split(', ').map(b => { const m = /^or hold (.+)$/.exec(b); return m ? '或按住' + (ZH[m[1]] || (m[1] === 'Space' ? '空格' : m[1])) : BITS[b] || ZH[b] || b; }).join('，')).join(' · ');
  }
  function tr(s) {
    const t = s.replace(/\s+/g, ' ').trim(); if (!t || !/[A-Za-z]/.test(t)) return null;
    let r = one(t);
    if (r == null && t.includes(' · ')) { let any = false; const parts = t.split(' · ').map(p => { const x = one(p); if (x != null) any = true; return x ?? p; }); if (any) r = parts.join(' · '); }
    if (r == null) return null;
    const lead = s.match(/^\s*/)[0], tail = s.match(/\s*$/)[0];
    return lead + r + tail;
  }
  /* never touched: the drawing, maths, code, fields, page names, layout names typed by the user */
  const SKIP = '#world, #ov, #edges, #laser, #minimap, .katex, pre, code, textarea, input, [contenteditable="true"], [contenteditable="plaintext-only"], .tab-track, .gcode, .dk-name, [data-noi18n]';
  const ATTRS = ['title', 'placeholder', 'aria-label'];
  const segs = new Set();
  function doText(n) {
    const p = n.parentElement; if (!p || p.closest(SKIP)) return;
    const v = tr(n.nodeValue); if (v != null && v !== n.nodeValue) { n.nodeValue = v; const sg = p.closest('.seg'); if (sg) segs.add(sg); }
  }
  function doEl(el) {
    if (el.closest(SKIP)) return;
    for (const a of ATTRS) { const v0 = el.getAttribute(a); if (v0) { const v = tr(v0); if (v != null && v !== v0) el.setAttribute(a, v); } }
  }
  function walk(root) {
    if (root.nodeType === 3) { doText(root); return; }
    if (root.nodeType !== 1) return;
    if (root.closest(SKIP)) return;
    doEl(root);
    const it = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, { acceptNode: x => x.nodeType === 1 && x.matches(SKIP) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT });
    for (let x = it.nextNode(); x; x = it.nextNode()) x.nodeType === 3 ? doText(x) : doEl(x);
  }
  function flushSegs() { if (!segs.size) return; const sync = window.Figura && window.Figura.syncSeg; if (sync) segs.forEach(sg => { try { sync(sg); } catch { } }); segs.clear(); }

  window.FigLang = {
    get lang() { return lang; },
    set(l) { if (l === lang) return; try { localStorage.setItem(LS, l); } catch { } location.reload(); },
    t: s => (lang === 'zh' ? tr(s) ?? s : s),
  };
  if (lang !== 'zh') return;
  const start = () => {
    walk(document.body); flushSegs();
    new MutationObserver(ms => {
      for (const m of ms) {
        if (m.type === 'characterData') doText(m.target);
        else if (m.type === 'attributes') doEl(m.target);
        else m.addedNodes.forEach(walk);
      }
      flushSegs();
    }).observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ATTRS });
  };
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start);
})();
