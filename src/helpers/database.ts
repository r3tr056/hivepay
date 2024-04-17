import { Client, Operation, PrivateKey } from "@hiveio/dhive";
import { getClient } from "./hiveClient";

const client = getClient();

interface CustomData {
    id: string;
    data: any;
}

class HiveDatabase {
    private client: Client;
    private postingAccount: string;
    private postingKey: PrivateKey;

    constructor(postingAccount: string, postingKey: string) {
        this.client = getClient();
        this.postingAccount = postingAccount;
        this.postingKey = PrivateKey.fromString(postingKey);
    }

    async addData(id: string, data: any): Promise<void> {
        const customJSON = JSON.stringify({ data });
        const customJSONop = {
            id: id,
            required_auths: [],
            required_posting_auths: [this.postingAccount],
            json: customJSON,
        };

        try {
            await this.client.broadcast.json(customJSONop, this.postingKey);
            console.log('Data added successfully');
        } catch (error) {
            console.error('Error adding data: ', error);
            throw error;
        }
    }

    async updateData(id: string, data: any): Promise<void> {
        try {
            const existingData = await this.getData(id);
            if (!existingData) {
                throw new Error('Data not found');
            }

            const mergedData = { ...existingData, ...data };
            await this.addData(id, mergedData);
            console.log('Data updated successfully');
        } catch (error) {
            console.error('Error updating data: ', error);
            throw error;
        }
    }

    async getData(id: string): Promise<any | null> {
        try {
            const result = await this.client.database.getDiscussions('blog', {
                tag: id,
                limit: 1,
            });
            if (result.length > 0) {
                const jsonMetadata = JSON.parse(result[0].json_metadata);
                return jsonMetadata.data;
            } else {
                return null;
            }
        } catch (error) {
            console.error('Error getting data : ', error);
            throw error;
        }
    }

    async deleteData(id: string): Promise<void> {
        try {
            await this.addData(id, null);
            console.log('Data deleted successfully');
        } catch (error) {
            console.error('Error deleting data', error);
            throw error;
        }
    }

    async getDataWithPagination(tag: string, limit: number, startAuthor?: string, startPermlink?: string): Promise<any[]> {
        try {
            const result = await this.client.database.getDiscussions('blog', {
                tag: tag,
                limit: limit,
                start_author: startAuthor,
                start_permlink: startPermlink,
            });

            return result.map(post => {
                const jsonMetadata = JSON.parse(post.json_metadata);
                return jsonMetadata.data;
            });
        } catch (error) {
            console.error('Error getting data wigth pagination: ', error);
            throw error;
        }
    }

    // Asynchronous Operations
    async addDataAsync(id: string, data: any): Promise<void> {
        try {
            const customJson = JSON.stringify({ data });
            const customJsonOp = {
                id: id,
                required_auths: [],
                required_posting_auths: [this.postingAccount],
                json: customJson,
            };
            await this.client.broadcast.json(customJsonOp, this.postingKey);
            console.log('Data added successfully (async)');
        } catch (error) {
            console.error('Error adding data (async):', error);
            throw error;
        }
    }

    // Batch Processing
    async batchAddData(dataList: CustomData[]): Promise<void> {
        const operations = dataList.map(item => ['custom_json', {
            id: item.id,
            required_auths: [],
            required_posting_auths: [this.postingAccount],
            json: JSON.stringify({ data: item.data }),
        }] as Operation);

        try {
            await this.client.broadcast.sendOperations(operations, this.postingKey);
            console.log('Batch data added successfully');
        } catch (error) {
            console.error('Error adding batch data:', error);
            throw error;
        }
    }
}