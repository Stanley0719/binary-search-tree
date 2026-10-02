const defaultValues = [50, 30, 70, 20, 40, 60, 80];

const state = {
  mode: "insert",
  steps: [],
  stepIndex: 0,
  traversalOrder: "inorder",
  autoTimer: null,
  tree: null,
  codeLine: 0
};

const treeSvg = document.getElementById("treeSvg");
const customInput = document.getElementById("customInput");
const stepTitle = document.getElementById("stepTitle");
const stepMessage = document.getElementById("stepMessage");
const nodeCountEl = document.getElementById("nodeCount");
const treeHeightEl = document.getElementById("treeHeight");
const inorderTextEl = document.getElementById("inorderText");
const traversalOutput = document.getElementById("traversalOutput");

function cloneTree(node) {
  if (!node) return null;
  return {
    value: node.value,
    left: cloneTree(node.left),
    right: cloneTree(node.right)
  };
}

function createTree(values) {
  let root = null;
  values.forEach((value) => {
    root = insertNode(root, value);
  });
  return root;
}

function insertNode(root, value) {
  if (!root) {
    return { value, left: null, right: null };
  }
  if (value < root.value) {
    root.left = insertNode(root.left, value);
  } else if (value > root.value) {
    root.right = insertNode(root.right, value);
  }
  return root;
}

function searchNode(root, value) {
  if (!root) return false;
  if (value === root.value) return true;
  return value < root.value ? searchNode(root.left, value) : searchNode(root.right, value);
}

function removeNode(root, value) {
  if (!root) return null;
  if (value < root.value) {
    root.left = removeNode(root.left, value);
    return root;
  }
  if (value > root.value) {
    root.right = removeNode(root.right, value);
    return root;
  }

  if (!root.left && !root.right) {
    return null;
  }
  if (!root.left) {
    return root.right;
  }
  if (!root.right) {
    return root.left;
  }

  let successor = root.right;
  while (successor.left) {
    successor = successor.left;
  }

  root.value = successor.value;
  root.right = removeNode(root.right, successor.value);
  return root;
}

function treeHeight(node) {
  if (!node) return 0;
  return 1 + Math.max(treeHeight(node.left), treeHeight(node.right));
}

function inorderList(node, arr = []) {
  if (!node) return arr;
  inorderList(node.left, arr);
  arr.push(node.value);
  inorderList(node.right, arr);
  return arr;
}

function preorderList(node, arr = []) {
  if (!node) return arr;
  arr.push(node.value);
  preorderList(node.left, arr);
  preorderList(node.right, arr);
  return arr;
}

function postorderList(node, arr = []) {
  if (!node) return arr;
  postorderList(node.left, arr);
  postorderList(node.right, arr);
  arr.push(node.value);
  return arr;
}

function levelOrder(node) {
  const result = [];
  if (!node) return result;
  const queue = [node];
  while (queue.length) {
    const current = queue.shift();
    result.push(current.value);
    if (current.left) queue.push(current.left);
    if (current.right) queue.push(current.right);
  }
  return result;
}

function layoutTree(node, depth = 0, x = 495, span = 425) {
  if (!node) return [];
  const items = [];
  items.push({ value: node.value, x, y: 80 + depth * 90, depth });
  if (node.left) {
    const leftX = x - span / (2 ** (depth + 1));
    items.push(...layoutTree(node.left, depth + 1, leftX, span / 2));
  }
  if (node.right) {
    const rightX = x + span / (2 ** (depth + 1));
    items.push(...layoutTree(node.right, depth + 1, rightX, span / 2));
  }
  return items;
}

function renderLayoutStep(step) {
  const tree = step.tree || null;
  const nodes = layoutTree(tree);
  const map = new Map(nodes.map((node) => [node.value, node]));

  const svgLines = [];
  const svgNodes = [];
  const dropNode = step.drop ?? null;

  if (tree) {
    const queue = [tree];
    const seen = new Set();
    while (queue.length) {
      const current = queue.shift();
      if (!current) continue;
      if (seen.has(current.value)) continue;
      seen.add(current.value);
      const pos = map.get(current.value);
      if (!pos) continue;
      if (current.left) {
        const leftPos = map.get(current.left.value);
        svgLines.push(`<line class="tree-link" x1="${pos.x}" y1="${pos.y + 22}" x2="${leftPos.x}" y2="${leftPos.y - 22}" />`);
        queue.push(current.left);
      }
      if (current.right) {
        const rightPos = map.get(current.right.value);
        svgLines.push(`<line class="tree-link" x1="${pos.x}" y1="${pos.y + 22}" x2="${rightPos.x}" y2="${rightPos.y - 22}" />`);
        queue.push(current.right);
      }
    }
  }

  nodes.forEach((node) => {
    const isCurrent = Number(step.current) === node.value;
    const isDrop = dropNode !== null && Number(dropNode) === node.value;
    const className = isCurrent ? "node-circle red" : isDrop ? "node-circle orange" : "node-circle";
    svgNodes.push(`
      <circle class="${className}" cx="${node.x}" cy="${node.y}" r="22" />
      <text class="node-text" x="${node.x}" y="${node.y}">${node.value}</text>
    `);
  });

  if (dropNode !== null) {
    const targetX = step.dropTargetX ?? 495;
    const targetY = step.dropTargetY ?? 56;
    svgNodes.push(`
      <rect class="drop-box" x="${targetX - 18}" y="${targetY - 18}" width="36" height="36" rx="8" />
      <text class="drop-text" x="${targetX}" y="${targetY}">${dropNode}</text>
    `);
  }

  treeSvg.innerHTML = `${svgLines.join("")}${svgNodes.join("")}`;
}

function setTraversalOrder(order) {
  state.traversalOrder = order;
  document.querySelectorAll(".traversal-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.order === order);
  });
  refreshTraversalOutput();
}

function refreshTraversalOutput() {
  const tree = state.steps[state.stepIndex]?.tree ?? null;
  if (!tree) {
    traversalOutput.textContent = "尚未產生走訪結果";
    return;
  }

  let ordered = [];
  if (state.traversalOrder === "preorder") ordered = preorderList(tree);
  if (state.traversalOrder === "inorder") ordered = inorderList(tree);
  if (state.traversalOrder === "postorder") ordered = postorderList(tree);
  if (state.traversalOrder === "levelorder") ordered = levelOrder(tree);

  traversalOutput.textContent = ordered.length ? ordered.join(" → ") : "空樹";
}

function updateStats(step) {
  const tree = step.tree || null;
  const count = countNodes(tree);
  const height = treeHeight(tree);
  const order = inorderList(tree);
  nodeCountEl.textContent = String(count);
  treeHeightEl.textContent = String(height);
  inorderTextEl.textContent = order.length ? order.join(" ") : "—";
}

function countNodes(node) {
  if (!node) return 0;
  return 1 + countNodes(node.left) + countNodes(node.right);
}

function buildInsertSteps(values) {
  const steps = [];
  let root = null;
  steps.push({
    title: "空樹",
    message: "空樹——連樹根都還沒有。每個節點會由 struct Node 定義：一個數字加左右兩個指標。",
    tree: null,
    current: null,
    drop: null,
    codeLine: 1
  });

  values.forEach((value, index) => {
    let current = root;
    const path = [];
    while (current) {
      path.push(current.value);
      if (value < current.value) current = current.left;
      else if (value > current.value) current = current.right;
      else break;
    }

    const beforeTree = cloneTree(root);
    root = insertNode(root, value);

    steps.push({
      title: `${value} 被插入`,
      message: `數字 ${value} 往下比較，最後落在唯一屬於它的位置。這是 BST 的核心規則：左小右大。`,
      tree: cloneTree(root),
      current: value,
      drop: value,
      dropTargetX: 495,
      dropTargetY: 58,
      codeLine: 2 + (index % 4),
      beforeTree
    });
  });

  return steps;
}

function buildSearchSteps(values, target) {
  const steps = [];
  let root = createTree(values);
  let current = root;
  let path = [];

  steps.push({
    title: "搜尋開始",
    message: `現在要找的是 ${target}。BST 會從根節點一路比較，若比它小就往左，若比它大就往右。`,
    tree: cloneTree(root),
    current: current ? current.value : null,
    drop: target,
    codeLine: 9
  });

  while (current) {
    path.push(current.value);
    if (target === current.value) {
      steps.push({
        title: "找到目標",
        message: `找到 ${target}！這個數字正好等於目前節點，搜尋成功。`,
        tree: cloneTree(root),
        current: current.value,
        drop: target,
        codeLine: 10
      });
      break;
    }
    if (target < current.value) {
      current = current.left;
    } else {
      current = current.right;
    }
    steps.push({
      title: "一路比較",
      message: `${target} 與 ${path[path.length - 1]} 比較，往 ${target < path[path.length - 1] ? "左" : "右"} 繼續找。`,
      tree: cloneTree(root),
      current: current ? current.value : null,
      drop: target,
      codeLine: 12
    });
  }

  if (!current) {
    steps.push({
      title: "搜尋失敗",
      message: `掉出樹外了，${target} 不存在於這棵樹中。`,
      tree: cloneTree(root),
      current: null,
      drop: target,
      codeLine: 12
    });
  }

  return steps;
}

function buildDeleteSteps(values, target) {
  const steps = [];
  let root = createTree(values);
  steps.push({
    title: "刪除前",
    message: `準備刪除 ${target}。刪除時要分成三種情況：葉節點、單子節點、雙子節點。`,
    tree: cloneTree(root),
    current: target,
    drop: target,
    codeLine: 18
  });

  if (!searchNode(root, target)) {
    steps.push({
      title: "刪除失敗",
      message: `${target} 不存在，無法刪除。`,
      tree: cloneTree(root),
      current: null,
      drop: target,
      codeLine: 18
    });
    return steps;
  }

  const before = cloneTree(root);
  root = removeNode(root, target);
  steps.push({
    title: "刪除完成",
    message: `${target} 已經成功移除。若它有兩個孩子，程式會找中序後繼來頂替。`,
    tree: cloneTree(root),
    current: null,
    drop: null,
    codeLine: 27
  });

  return steps;
}

function buildTraversalSteps(root) {
  const tree = cloneTree(root);
  if (!tree) {
    return [{
      title: "空樹",
      message: "樹是空的，還沒有節點可走訪。",
      tree: null,
      current: null,
      drop: null,
      codeLine: 1
    }];
  }

  return [{
    title: "走訪樹",
    message: "現在開始遍歷整棵樹。每種走法只差在「什麼時候印自己」。",
    tree: tree,
    current: null,
    drop: null,
    codeLine: 1
  }];
}

function parseValues(raw) {
  const match = raw
    .split(/[,\s]+/)
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => Number(item));

  const valid = match.filter((n) => Number.isFinite(n));
  return valid;
}

function refreshMode(mode) {
  state.mode = mode;
  const values = parseValues(customInput.value);
  const seq = values.length ? values : defaultValues;

  if (mode === "insert") {
    state.steps = buildInsertSteps(seq);
  } else if (mode === "search") {
    const target = Number(seq[0] ?? 40);
    state.steps = buildSearchSteps(seq, target);
  } else if (mode === "delete") {
    const target = Number(seq[0] ?? 20);
    state.steps = buildDeleteSteps(seq, target);
  } else if (mode === "traversal") {
    state.steps = buildTraversalSteps(createTree(seq));
  }

  state.stepIndex = Math.min(state.stepIndex, state.steps.length - 1);
  if (state.steps.length === 0) state.stepIndex = 0;
  renderCurrentStep();
}

function renderCurrentStep() {
  const current = state.steps[state.stepIndex] || {
    title: "空樹",
    message: "目前沒有步驟。",
    tree: null,
    current: null,
    drop: null,
    codeLine: 1
  };

  stepTitle.textContent = current.title || "空樹";
  stepMessage.textContent = current.message || "";
  renderLayoutStep(current);
  updateStats(current);
  refreshTraversalOutput();
}

function nextStep() {
  if (state.stepIndex < state.steps.length - 1) {
    state.stepIndex += 1;
    renderCurrentStep();
  }
}

function prevStep() {
  if (state.stepIndex > 0) {
    state.stepIndex -= 1;
    renderCurrentStep();
  }
}

function toggleAutoPlay() {
  if (state.autoTimer) {
    clearInterval(state.autoTimer);
    state.autoTimer = null;
    return;
  }

  state.autoTimer = setInterval(() => {
    if (state.stepIndex < state.steps.length - 1) {
      state.stepIndex += 1;
      renderCurrentStep();
    } else {
      clearInterval(state.autoTimer);
      state.autoTimer = null;
    }
  }, 800);
}

function resetDemo() {
  if (state.autoTimer) {
    clearInterval(state.autoTimer);
    state.autoTimer = null;
  }
  const values = parseValues(customInput.value);
  const seq = values.length ? values : defaultValues;
  refreshMode(state.mode === "traversal" ? "traversal" : "insert");
  state.stepIndex = 0;
  renderCurrentStep();
}

function bindEvents() {
  document.getElementById("nextBtn").addEventListener("click", nextStep);
  document.getElementById("prevBtn").addEventListener("click", prevStep);
  document.getElementById("autoBtn").addEventListener("click", toggleAutoPlay);
  document.getElementById("resetBtn").addEventListener("click", resetDemo);

  document.getElementById("applyCustomBtn").addEventListener("click", () => {
    refreshMode(state.mode);
  });

  document.querySelectorAll(".mode-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".mode-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      refreshMode(btn.dataset.mode);
    });
  });

  document.querySelectorAll(".traversal-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      setTraversalOrder(btn.dataset.order);
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") nextStep();
    if (event.key === "ArrowLeft") prevStep();
    if (event.key === " ") {
      event.preventDefault();
      toggleAutoPlay();
    }
  });
}

bindEvents();
refreshMode("insert");
setTraversalOrder("inorder");
renderCurrentStep();
