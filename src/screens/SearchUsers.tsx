import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { FlatList, View } from 'react-native';
import { Searchbar, Text } from 'react-native-paper';
import { TrieNode, searchPrefix } from '../helpers/search';

const SearchUsers = () => {
    const navigation = useNavigation();

    const [searchQuery, setSearchQuery] = useState<string>('');
    const [searchResults, setSearchResults] = useState<string[]>([]);

    const handleSearch = async (searchQuery: string) => {
        setSearchQuery(searchQuery)

        // Fetch trie index from AsyncStorage
        const indexString = await AsyncStorage.getItem('index');
        const trieRoot: TrieNode = indexString ? JSON.parse(indexString) : { children: {}, isEndOfWord: false };

        // search for usernames with the given search query
        const results = searchPrefix(trieRoot, searchQuery);
        setSearchResults(results);
    }

    const onUsernameTap = async (username: string) => {
        navigation.navigate('Send', { username, amount: '', memo: '' })
    }

    return (
        <View>
            <Searchbar
                placeholder="Search usernames..."
                onChangeText={handleSearch}
                value={searchQuery}
            />
            <FlatList data={searchResults} renderItem={({ item }) => <Text>{item}</Text>} keyExtractor={(item, index) => index.toString()} />
        </View>
    );
};

export default SearchUsers;
