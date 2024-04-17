
export interface UserAccount {
    username: string;
}

export interface TrieNode {
    children: Record<string, TrieNode>;
    isEndOfWord: boolean;
}

// helper function to insert a word into the trie
export const insertIntoTrie = (root: TrieNode, word: string) => {
    let current = root;
    for (const char of word) {
        if (!current.children[char]) {
            current.children[char] = { children: {}, isEndOfWord: false };
        }
        current = current.children[char];
    }
    current.isEndOfWord = true;
}

// helper function to search for words with a given prefix in the trie
export const searchPrefix = (root: TrieNode, prefix: string): string[] => {
    if (!root) {
        return [];
    }

    let current = root;
    for (const char of prefix) {
        if (!current.children[char]) {
            return [];
        }
        current = current.children[char];
    }

    const results: string[] = [];
    const dfs = (node: TrieNode, prefix: string) => {
        if (node.isEndOfWord) {
            results.push(prefix);
        }
        for (const char in node.children) {
            dfs(node.children[char], prefix + char);
        }
    };

    dfs(current, prefix);
    return results;
}

export const createIndex = (accounts: UserAccount[]): TrieNode => {
    const root: TrieNode = { children: {}, isEndOfWord: false };
    accounts.forEach(account => {
        insertIntoTrie(root, account.username);
    });
    return root;
};

