<template>
    <div>

        <div class="text-center mb-5 d-flex justify-center align-center">
            <v-divider length="200" class="d-inline"></v-divider>
            <h2 class="mx-5 px-5">Manage stores</h2>
            <v-divider length="200" class="d-inline"></v-divider>
        </div>

        
        <v-row class="mt-5 mb-5" >
            <v-col  cols="12">
                
                <v-table>
                    <thead>
                        <tr>
                            <th class="text-left">
                                ID
                            </th>
                            <th class="text-left">
                                Ime
                            </th>
                            <th class="text-left">
                                Opis
                            </th>
                            <th class="text-left">
                                Url
                            </th>
                            <th class="text-left">
                                Akcije
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, i) in items" :key="i" >
                            <td>{{ item.id }}</td>
                            <td>{{ item.name }}</td>
                            <td>{{ item.description }}</td>
                            <td>{{ item.url }}</td>
                            <td>
                                <v-icon
                                    small
                                    class="mr-2"
                                    @click="startEdit(item)"
                                >
                                    mdi-pencil
                                </v-icon>
                                <v-icon
                                    small
                                    @click="deleteItem(item)"
                                >
                                     mdi-delete
                                </v-icon>
                            </td>
                        </tr>
                    </tbody>
                    </v-table>


            </v-col>
                
        </v-row>
        <v-card>
            <v-card-title>
              <span class="text-h5">Dodaj nov produkt</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.name"
                      label="Ime"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.description"
                      label="Opis"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.url"
                      label="Url"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="blue darken-1"
                text
                @click="this.addOrModify(this.editedItem)"
              >
                Dodaj / Uredi
              </v-btn>
            </v-card-actions>

          </v-card>

    </div>
</template>

<script>
import ProductCard from '@/components/ProductCard.vue';
import { BASE_URL_STORE } from "@/utils/constants.js"
import axios from 'axios';

export default {
    data() {
        return {
            items: [],
            endpoint: `${BASE_URL_STORE}/store-catalog/graphql/`,
            editedItem: {

            }

        }
    },
    methods: {
        getItems() {
            const headers = {
                "content-type": "application/json",
            };
            const graphqlQuery = {
                "operationName": "getStores",
                "query": `query getStores { allStores { id description name url } }`,
                "variables": {}
            };
            

            axios({
                url: this.endpoint,
                method: 'post',
                headers: headers,
                data: graphqlQuery
            }).then((response) => {
                this.items = response.data["data"]["allStores"]
            }).catch((e) => {
                const mockResponse = {"data":{"allStores":[{"id":1,"description":"Razno","name":"Big bang","url":"https://www.bigbang.si"},{"id":2,"description":"Drugo","name":"Mimovrste","url":"https://www.mimovrste.com"}]}}
                this.items = mockResponse["data"]["allStores"]
            })

        },
        addItem(item){
            const headers = {
                    "content-type": "application/json",
                };
            const graphqlQuery = {
                "operationName": "addStore",
                "query": `mutation addStore { addStore(store: { name: "${item.name}" description: "${item.description}" url: "${item.url}" } ) { id description name url } }`,
                "variables": {}
            };
            axios({
                url: this.endpoint,
                method: 'post',
                headers: headers,
                data: graphqlQuery
            }).then((response) => {
                this.getItems()
            }).catch((e) => {
                this.getItems()
            })
        },
        addOrModify(item){
            if (item.id){
                this.modifyItem(item)
            }else{
                this.addItem(item)
            }
        },
        startEdit(item){
            this.editedItem = Object.assign({}, item)
        },
        modifyItem(item){
            const headers = {
                    "content-type": "application/json",
                };
                const graphqlQuery = {
                "operationName": "modifyStore",
                "query": `mutation modifyStore { modifyStore(store: { id: "${item.id}" name: "${item.name}" description: "${item.description}" url: "${item.url}" } ) { id description name url } }`,
                "variables": {}
            };
            axios({
            url: this.endpoint,
            method: 'post',
            headers: headers,
            data: graphqlQuery
            }).then((response) => {
                getItems()
            }).catch((response) => {
                this.getItems()
            })
        },
        deleteItem(item){
            const headers = {
                    "content-type": "application/json",
                };
            const graphqlQuery = {
                "operationName": "deleteStore",
                "query": `mutation deleteStore { deleteStore( storeId: "${item.id}" ) }`,
                "variables": {}
            };
            axios({
            url: this.endpoint,
            method: 'post',
            headers: headers,
            data: graphqlQuery
            }).then((response) => {
                getItems()
            }).catch((response) => {
                this.getItems()
            })
        },
    },
    mounted() {
        this.getItems()
    },
    
    components: {
        ProductCard
    }
};
</script>