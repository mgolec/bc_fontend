<template>
  <div id="app">
    <link type="text/css" rel="stylesheet" href="//unpkg.com/bootstrap/dist/css/bootstrap.min.css"/>
    <link type="text/css" rel="stylesheet" href="//unpkg.com/bootstrap-vue@latest/dist/bootstrap-vue.css"/>
    <header>
      <span>Hyperledger Composer - frontend</span>
    </header>
    <main>

      <div style="margin-bottom: 30px">

      <button id="btn" class="btn btn-success btn-lg" v-if="tradersStart" @click="tradersStart = !tradersStart">Traders</button>

      <button id="btn" class="btn btn-success btn-lg" v-if="!tradersStart" @click="getTraders">View all traders </button>
      <button id="btn" class="btn btn-success btn-lg" v-if="!tradersStart" @click="createTrader">Create new trader</button>
      <button id="btn" class="btn btn-success btn-lg" v-if="!tradersStart" @click="goBack">Back</button>

      </div>

      <div v-if="loading">
        <img src="../src/assets/loader.gif" />
      </div>

      <div class="wrapper">
        <div class="row">
          <div class="offset-md-2 col-md-8">
            <table class="table table-hover" v-if="loadTraders">
              <thead>
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">First Name</th>
                  <th scope="col">Last Name</th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="trader in traders" :key="trader.tradeId">
                  <th scope="row">{{ trader.tradeId }}</th>
                  <td>{{ trader.firstName }}</td>
                  <td>{{ trader.lastName }}</td>
                  <td>
                    <button id="btn" class="btn btn-outline-danger btn-sm" @click="deleteTrader(trader.tradeId)">Delete</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="wrapper">
        <div class="row">
          <div class="offset-md-3 col-md-6" v-if="createNewTrader">
            
               <form method="post" @submit.prevent="setTrader">
                <div class="form-group">
                  <br><br>
                  <input type="text" class="form-control" id="id" placeholder="ID" v-model="id">
                   </div>
                <div class="form-group">
                  <input type="text" class="form-control" id="ime" placeholder="Ime" v-model="name">
                </div>
                <div class="form-group">
                  <input type="text" class="form-control" id="prezime" placeholder="Prezime" v-model="surname">
                </div>
                
                <button type="submit" class="btn btn-outline-success" @submit.prevent="setTrader">Submit</button>
              </form>

              
            
          </div>
        </div>
      </div>

    </main>
  </div>
</template>

<script>
 //import axios from 'axios';
  import {
    API
  } from './axios'

  export default {
    name: 'app',
    data() {
      return {
        traders: [],
        id: '',
        name: '',
        surname: '',
        tradersStart: true,
        loadTraders: false,
        createNewTrader: false,
        loading: false
      }
    },
    methods: {
      goBack: function () {
        this.tradersStart = !this.tradersStart;
        this.loadTraders = false;
        this.createNewTrader = false;
      },
      createTrader: function () {
        this.loadTraders = false;
        this.createNewTrader = true;

      },
      getTraders: function () {
        this.createNewTrader = false;
        this.loadTraders = true;
        this.loading = true;
        API.get()
          .then((response) => {
            this.loading = false;
            this.traders = response.data;
            console.log(response.data);
            console.log(response.status);
            console.log(this.id_status = this.traders.length); 
          }, (error) => {
            this.loading = false;
            if (error.message === "Network Error"){
              Vue.toasted.error("Error! Can't reach server!", { 
              theme: "outline", 
              position: "bottom-center",
              fullWidth: true, 
              duration : 5500
        });}
            Vue.toasted.error('Error while loading traders:' + error.response.status, { 
              theme: "outline", 
              position: "bottom-center",
              fullWidth: true, 
              duration : 2500
        });
            console.log(error);
          })
      },
      deleteTrader: function(deleteId){
          this.loading = true;
          API.delete('/' + deleteId)
          .then((response) => {
            this.loading = false;
            if(response.status == 204){
              Vue.toasted.success('successfully deleted', { 
              theme: "outline", 
              position: "bottom-center",
              fullWidth: true, 
              duration : 2500
        });
              this.getTraders();
            }else{
              this.loading = false;
              Vue.toasted.error('delete error', { 
              theme: "outline", 
              position: "bottom-center",
              fullWidth: true, 
              duration : 2500
        });
            }
            console.log(response.status);
            console.log(response.data)
          })
      },
      setTrader: function () {
        console.log(this.name, this.surname, this.id);
        // if (this.id_status <9){
        //    this.id_status="T0" + (this.id_status+1);
        //    }
        //    else{
        //    this.id_status="T" + (this.id_status+1);
        //  }
        this.loading = true;
        API.post('', {
            tradeId: this.id,
            firstName: this.name,
            lastName: this.surname,
          }, {
            headers: {
              'Content-type': 'application/json;charset=utf-8',
            }
          }).then((response) => {
            this.loading = false;
            console.log('response: ', JSON.stringify(response, null, 2));
            console.log(response.status);
            if(response.status == 200){
            Vue.toasted.success('successfully added new entery', { 
              theme: "outline", 
              position: "bottom-center",
              fullWidth: true, 
              duration : 2500
        });
            this.id = '',
            this.name = '',
            this.surname = ''
            }
          })
          .catch((error) => {
            this.loading = false;
            // Error
             if (error.message === "Network Error"){
              Vue.toasted.error("Error! Can't reach server!", { 
              theme: "outline", 
              position: "bottom-center",
              fullWidth: true, 
              duration : 5500
        });}
            if (error.response) {
              // The request was made and the server responded with a status code
              // that falls out of the range of 2xx
              // console.log(error.response.data);
              Vue.toasted.error('Error while adding new entery. Error code: ' + error.response.status, { 
              theme: "outline", 
              position: "bottom-center",
              fullWidth: true, 
              duration : 2500
        });
              console.log('povratni kod je: ' + error.response.status);
              // console.log(error.response.headers);
            } else if (error.request) {
              Vue.toasted.error('Error while adding new entery. Error code: ' + error.response.status, { 
              theme: "outline", 
              position: "bottom-center",
              fullWidth: true, 
              duration : 2500
        });
              // The request was made but no response was received
              // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
              // http.ClientRequest in node.js
              console.log(error.request);
            } else {
              // Something happened in setting up the request that triggered an Error
              Vue.toasted.error('Error while adding new entery. Error code: ' + error.response.status, { 
              theme: "outline", 
              position: "bottom-center",
              fullWidth: true, 
              duration : 2500
        });
              console.log('Error', error.message);
            }
            console.log(error.config);
          });
      }, 
    }
  }

</script>


<style>
import bootstrap/dist/css/bootstrap.css
import bootstrap-vue/dist/bootstrap-vue.css

  body {
    margin: 0;
  }

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
  }

  main {
    text-align: center;
    margin-top: 40px;
  }

  header {
    margin: 0;
    height: 56px;
    padding: 0 16px 0 24px;
    background-color: #35495E;
    color: #ffffff;
  }

  header span {
    display: block;
    position: relative;
    font-size: 20px;
    line-height: 1;
    letter-spacing: .02em;
    font-weight: 400;
    box-sizing: border-box;
    padding-top: 16px;
  }

  /* button {
    background: #51B767;
    color: #ffffff;
    padding: 15px;
    border-radius: 0;
    font-weight: bold;
    font-size: 15px;
    border: 0;
  } */

  .cards {
    background: #F5F5F5;
    height: 400px;
  }

  .cards:hover {
    transform: translateY(-0.5em);
    background: #EBEBEB;
  }

  .cards {
    column-count: 1;
    column-gap: 1em;
    margin-top: 70px;
  }

</style>
