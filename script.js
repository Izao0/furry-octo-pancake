const BASE_URL =
  "https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses";
const GOODS = `${BASE_URL}/catalogData.json`;
const GET_BASKET_GOODS_ITEMS = `${BASE_URL}/getBasket.json`;

function service(url) {
  return fetch(url).then((res) => res.json());
}

function init() {


  Vue.component('custom-search', {
    template: `
    <input type="text" class="goods-search" @input="$emit('input', $event.target.value)"/>
    `
  })

  Vue.component('basket', {
    template: `
      <div class="fixed-area">
         <div class="basket-card">
            <div class="basket-card__header">
               <h1 class="basket-card__header__title">basket card</h1>
               <div class="basket-card__header__delete-icon"
                  v-on:click="$emit('close')"
               ></div>
            </div>
            <div class="basket-card__content">
               content
            </div>
         </div>
      </div>
    `
  })
/*
  Vue.component('custom-button', {
    template: `
      <button class="search-button" type="button" @click="$emit('click')>
        <slot> </slot>
      </button>
    `
    
    */

  Vue.component('custom-button', {
    template: `
    <button class="search-button" type="button" v-on:click="$emit('click')">
      <slot></slot>
    </button>
    `
  })
  Vue.component("good", {
    props:[
      'item'
    ],
    template: `
    <div class="goods-item">
      <h3>{{ item.product_name }}</h3>
      <p>{{ item.price }}</p>
    </div>
    `,
  });
  const app = new Vue({
    el: "#root",
    data: {
      items: [],
      searchValue: "",
      isVisibleCard: false,
    },
    methods: {
      fetchGoods() {
        service(GOODS).then((data) => {
          this.items = data;
          this.filteredItems = data;
        });
      },
      setVisibleCard() {
        this.isVisibleCard = !this.isVisibleCard;
      },
    },
    computed: {
      calculatePrice() {
        return this.filteredItems.reduce((prev, { price }) => {
          return prev + price;
        }, 0);
      },
      filteredItems() {
        return this.items.filter(({ product_name }) => {
          return product_name.match(new RegExp(this.searchValue, "gui"));
        });
      },
    },
    mounted() {
      this.fetchGoods();
    },
  });
}
window.onload = init;
