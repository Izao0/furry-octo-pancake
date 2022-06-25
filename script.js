const BASE_URL =
  "http://localhost:8000/";
const GOODS = `${BASE_URL}/goods.json`;
const GET_BASKET_GOODS_ITEMS = `${BASE_URL}basket`;

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
              <p class="basket-card__content__title">product 1<p>
              <span class="basket-card__price">200<span>
              <span class="basket-card__count"> 1шт.</span>
              <button class="basket-card__add">+</button>
              <button class="basket-card__remove">-</button>
            </div>
         </div>
      </div>
    `,
    mounted(){
      service(GET_BASKET_GOODS_ITEMS).then(() => {
        this.basketGoodsItems = data;
      })
    }
  })

  Vue.component('custom-button', {
    template: `
    <button class="search-button" type="button" v-on:click="$emit('click')">
      <slot>Добавить</slot>
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
      <div>
        <custom-button></custom-button>
      </div>
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
