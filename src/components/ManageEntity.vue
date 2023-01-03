<template>
    <div>

        <div class="text-center mb-5 d-flex justify-center align-center">
            <v-divider length="200" class="d-inline"></v-divider>
            <h2 class="mx-5 px-5">Uredi {{ metadata.title }}</h2>
            <v-divider length="200" class="d-inline"></v-divider>
        </div>

        
        <v-row class="mt-5 mb-5" >
            <v-col  cols="12">
                
                <v-table>
                    <thead>
                        <tr>
                            <th  v-for="header in metadata.headers" :key="i" class="text-left">
                                {{ header }}
                            </th>
                            <th>
                                Akcije
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, i) in items" :key="i" >
                            <td v-for="(element, j) in item" :key="j" >{{ element }}</td>
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
              <span class="text-h5">Dodaj / Uredi</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <template v-if="items" v-for="(value, key) in items[0]">
                    <v-col  v-if="key != 'id'"
                      cols="12"
                      sm="6"
                      md="4"
                    >
                      <v-text-field 
                        v-model="editedItem[key]"
                        :label="key"
                      ></v-text-field>
                      
                    </v-col>
                  </template>

                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn 
                v-if="editedItem && editedItem.id"
                color="blue darken-1"
                text
                @click="this.clearEdited"
              >
                Počisti izbiro
              </v-btn>
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
import axios from 'axios';

export default {
    data() {
        return {
            items: [],
            editedItem: {}

        }
    },
    props: ["endpoint", "metadata"],
    methods: {
        getItems() {
            
            axios.get(this.endpoint).then((response) => {
                this.items = response.data
            })

        },
        addItem(item){
            axios.post(this.endpoint, item).then((response) => {
                this.items = response.data
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
        clearEdited(){
          this.editedItem = {};
        },
        startEdit(item){
            this.editedItem = Object.assign({}, item)
        },
        modifyItem(item){
            axios.put(`${this.endpoint}/${item.id}`, item).then((response) => {
                this.getItems()
            })
        },
        deleteItem(item){
            axios.delete(`${this.endpoint}/${item.id}`).then((response) => {
                this.getItems()
            })
        },
    },
    mounted() {
        this.getItems()
    },
    
};
</script>