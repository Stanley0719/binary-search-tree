#include <iostream>
#include <limits>
using namespace std;

struct Node {
    int val;
    Node* left;
    Node* right;
};

Node* insert(Node* root, int x) {
    if (root == nullptr) {
        return new Node{x, nullptr, nullptr};
    }

    if (x < root->val) {
        root->left = insert(root->left, x);
    } else if (x > root->val) {
        root->right = insert(root->right, x);
    }
    return root;
}

bool search(Node* root, int x) {
    if (root == nullptr) return false;
    if (x == root->val) return true;
    return (x < root->val) ? search(root->left, x) : search(root->right, x);
}

Node* removeNode(Node* root, int x) {
    if (root == nullptr) return nullptr;

    if (x < root->val) {
        root->left = removeNode(root->left, x);
        return root;
    }
    if (x > root->val) {
        root->right = removeNode(root->right, x);
        return root;
    }

    if (root->left == nullptr && root->right == nullptr) {
        delete root;
        return nullptr;
    }
    if (root->left == nullptr) {
        Node* rightChild = root->right;
        delete root;
        return rightChild;
    }
    if (root->right == nullptr) {
        Node* leftChild = root->left;
        delete root;
        return leftChild;
    }

    Node* successor = root->right;
    while (successor->left != nullptr) {
        successor = successor->left;
    }

    root->val = successor->val;
    root->right = removeNode(root->right, successor->val);
    return root;
}

void inorder(Node* root) {
    if (root == nullptr) return;
    inorder(root->left);
    cout << root->val << " ";
    inorder(root->right);
}

void printTree(Node* root, int depth = 0) {
    if (root == nullptr) return;

    printTree(root->right, depth + 1);
    for (int i = 0; i < depth; ++i) cout << "    ";
    cout << root->val << "\n";
    printTree(root->left, depth + 1);
}

void destroyTree(Node* root) {
    if (root == nullptr) return;
    destroyTree(root->left);
    destroyTree(root->right);
    delete root;
}

void clearInput() {
    cin.clear();
    cin.ignore(numeric_limits<streamsize>::max(), '\n');
}

void showMenu() {
    cout << "\n===== 二元搜尋樹冒險遊戲 =====\n";
    cout << "1. 插入數字\n";
    cout << "2. 搜尋數字\n";
    cout << "3. 刪除數字\n";
    cout << "4. 看中序結果\n";
    cout << "5. 看樹狀結構\n";
    cout << "6. 重置樹\n";
    cout << "7. 離開遊戲\n";
    cout << "請選擇： ";
}

int main() {
    Node* root = nullptr;
    int values[] = {50, 30, 70, 20, 40, 60, 80};
    for (int v : values) {
        root = insert(root, v);
    }

    int choice = 0;
    int score = 0;

    cout << "歡迎來到 BST 冒險！\n";
    cout << "你需要在二元搜尋樹中操作數字，完成任務。\n";

    while (true) {
        showMenu();
        cin >> choice;

        if (cin.fail()) {
            clearInput();
            cout << "輸入錯誤！請輸入 1~7 之間的數字。\n";
            continue;
        }

        if (choice == 1) {
            int x;
            cout << "請輸入要插入的數字： ";
            cin >> x;
            if (cin.fail()) {
                clearInput();
                cout << "請輸入有效整數。\n";
                continue;
            }
            root = insert(root, x);
            score += 10;
            cout << "成功插入 " << x << "！\n";
        }
        else if (choice == 2) {
            int x;
            cout << "請輸入要搜尋的數字： ";
            cin >> x;
            if (cin.fail()) {
                clearInput();
                cout << "請輸入有效整數。\n";
                continue;
            }
            if (search(root, x)) {
                cout << "找到 " << x << "！\n";
                score += 15;
            } else {
                cout << x << " 不在樹裡。\n";
            }
        }
        else if (choice == 3) {
            int x;
            cout << "請輸入要刪除的數字： ";
            cin >> x;
            if (cin.fail()) {
                clearInput();
                cout << "請輸入有效整數。\n";
                continue;
            }

            if (search(root, x)) {
                root = removeNode(root, x);
                score += 20;
                cout << "成功刪除 " << x << "！\n";
            } else {
                cout << x << " 不存在，無法刪除。\n";
            }
        }
        else if (choice == 4) {
            cout << "中序結果：";
            inorder(root);
            cout << "\n";
        }
        else if (choice == 5) {
            cout << "樹狀結構：\n";
            printTree(root);
        }
        else if (choice == 6) {
            destroyTree(root);
            root = nullptr;
            int resetValues[] = {50, 30, 70, 20, 40, 60, 80};
            for (int v : resetValues) {
                root = insert(root, v);
            }
            score = 0;
            cout << "樹已重置！\n";
        }
        else if (choice == 7) {
            cout << "遊戲結束！\n";
            cout << "你的總分：" << score << "\n";
            destroyTree(root);
            break;
        }
        else {
            cout << "選項不存在，請重新輸入。\n";
        }
    }

    return 0;
}
