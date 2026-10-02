# 二元搜尋樹 (Binary Search Tree) Demo

這個專案展示如何實作一顆二元搜尋樹（BST），包含：

- 插入節點
- 搜尋值
- 刪除節點
- 中序走訪
- 清理記憶體

## 專案內容

- `main.cpp`：BST 的完整實作與範例
- `CMakeLists.txt`：CMake 建置設定

## 本機建置

```bash
cmake -S . -B build
cmake --build build
./build/bst_demo
```

如果你是在 Windows 的命令提示字元，請用：

```powershell
cmake -S . -B build
cmake --build build
.\build\Debug\bst_demo.exe
```

## 範例輸出

```text
中序走訪：20 30 40 50 60 70 80 
搜尋 40：找到
搜尋 99：未找到
刪除 50 後：20 30 40 60 70 80 
```

## 上傳到 GitHub

1. 初始化 Git：

```bash
git init
git add .
git commit -m "Initial BST demo"
```

2. 建立 GitHub Repository（例如在 GitHub 網頁建立空倉庫）
3. 連接遠端：

```bash
git branch -M main
git remote add origin <你的 GitHub Repository URL>
git push -u origin main
```

這個範例已經準備好可以直接放到 GitHub 上。 
