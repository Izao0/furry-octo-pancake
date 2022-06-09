const BASE_URL =
  "https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses";
const GOODS = `${BASE_URL}/catalogData.json`;
const GET_BASKET_GOODS_ITEMS = `${BASE_URL}/getBasket.json`;

function service(url) {
  return fetch(url)
  .then((res) => res.json())
}

function init() {
  const app = new Vue({
    el: '#root',
    data: {
      items: [],
      filteredItems: [],
      searchValue: '',
      isVisibleCard: false,
    },
    methods: {
      fetchGoods() {
        service(GOODS).then((data) => {
          this.items = data;
          this.filteredItems = data;
        });
      },
      filterItems() {
        this.filteredItems = this.items.filter(({ product_name }) => {
          return product_name.match(new RegExp(this.searchValue, 'gui'))
        })
      },
      setVisibleCard() {
        this.isVisibleCard = !this.isVisibleCard;
      }
    },
    computed: {
      calculatePrice() {
        return this.filteredItems.reduce((prev, { price }) => {
          return prev + price;
        }, 0)
      }
    },
    mounted() {
      this.fetchGoods();
    }
  })
}
window.onload = init