#include <iostream>
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
    if (root == nullptr) {
        return false;
    }

    if (x == root->val) {
        return true;
    }

    return (x < root->val) ? search(root->left, x) : search(root->right, x);
}

Node* removeNode(Node* root, int x) {
    if (root == nullptr) {
        return nullptr;
    }

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
    if (root == nullptr) {
        return;
    }

    inorder(root->left);
    cout << root->val << " ";
    inorder(root->right);
}

void destroyTree(Node* root) {
    if (root == nullptr) {
        return;
    }

    destroyTree(root->left);
    destroyTree(root->right);
    delete root;
}

int main() {
    int values[] = {50, 30, 70, 20, 40, 60, 80};
    Node* root = nullptr;

    for (int value : values) {
        root = insert(root, value);
    }

    cout << "中序走訪：";
    inorder(root);
    cout << endl;

    cout << "搜尋 40：" << (search(root, 40) ? "找到" : "未找到") << endl;
    cout << "搜尋 99：" << (search(root, 99) ? "找到" : "未找到") << endl;

    root = removeNode(root, 50);

    cout << "刪除 50 後：";
    inorder(root);
    cout << endl;

    destroyTree(root);
    return 0;
}
