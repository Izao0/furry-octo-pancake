const BASE_URL = "http://localhost:8000/";
const GOODS = `${BASE_URL}goods.json`;
const GET_BASKET_GOODS_ITEMS = `${BASE_URL}basket`;

function service(url) {
  return fetch(url).then((res) => res.json());
}

function init() {
  Vue.component("custom-search", {
    template: `
    <input type="text" class="goods-search" @input="$emit('input', $event.target.value)"/>
    `,
  });

  Vue.component("good", {
    props: ["item"],
    template: `
    <div class="goods-item">
      <h3>{{ item.product_name }}</h3>
      <p>{{ item.price }}</p>
    </div>
    `,
  });
  const CustomButton = Vue.component("search-button", {
    template: `
    <button class="search-button" type="button" v-on:click="$emit('click')">
       <slot></slot>
    </button>
  `,
  });
  const basketItem = Vue.component("basket-item", {
    props: ["item"],
    template: `
    <div class="basket-item">
      <span class="item__title"> {{ item.product_name }}</span>
      <span class="item__price">( {{ item.price }} )</span>
      <div class="basket-item__count">
        <span>{{ item.count }} шт.</span>
        <button>+</button>
        <button>-</button>
      </div>
    </div>
    `
    
  })
  const basketGoods = Vue.component("basket", {
    data() {
      return {
        basketGoodsItems: [],
      };
    },
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
            <basket-item v-for="item in basketGoodsItems" :item="item"></basket-item>
          </div>
       </div>
    </div>
    `,
    mounted() {
      service(GET_BASKET_GOODS_ITEMS).then((data) => {
        this.basketGoodsItems = data;
      })
    },
  });

  const goodsItem = Vue.component("goods-item", {
    props: ["item"],
    template: `
    <div class="goods-item">
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
