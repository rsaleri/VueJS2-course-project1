const PRICE = 9.99;
const PAGINATION_LIMIT = 10;

const shop = new Vue({
    el: "#app",
    data: {
        cart: [],
        total: 0,
        products: [],
        results: [],
        newSearch: "batman",
        lastSearch: "",
        loading: false,
        price: PRICE
    },
    methods:{
        searchSubmit(){
            this.products = [];
            this.loading = true;
            this.$http
                .get("search/" + this.newSearch)
                .then(
                    (result) => {
                        this.lastSearch=this.newSearch;
                        this.results = result.body;
                        this.appendItems();
                        this.loading = false;
                    },
                    () => console.log("ehm...")
                );
        },
        appendItems(){
            if(this.products.length < this.results.length){
                let append = this.results.slice(this.products.length, this.products.length + PAGINATION_LIMIT);
                this.products = this.products.concat(append);
            }
        },
        addToCart(item) {
            this.total += PRICE;
            let found = false;
            for (let i = 0; i < this.cart.length; i++) {
                if (this.cart[i].id === item.id) {
                    this.cart[i].qty++;
                    found = true;
                    break;
                }
            }
            if (!found) {
                this.cart.push({
                    id: item.id,
                    price: PRICE,
                    title: item.title,
                    qty: 1
                });
            }
        },
        inc(item){
            this.total += PRICE;
            item.qty++;
        },
        dec(item) {
            item.qty--;
            this.total -= PRICE;
            if(item.qty <= 0) {
                this.cart.splice(this.cart.indexOf(item), 1);
            }
        }
    },
    computed: {
        moreItems(){
            return this.products.length === this.results.length && this.results.length > 0? "No more items..." : "Loading...";
        }
    },
    filters: {
        currency(val) {
            if(typeof val !== 'number') {
                return val;
            } else {
                return val.toLocaleString('it-IT', { style: "currency", currency: "EUR", minimumFractionDigits: 2, maximumFractionDigits: 2});
            }
        }
    },
    mounted(){
        this.searchSubmit();
        const elem = document.getElementById("product-list-bottom");
        const watcher = scrollMonitor.create(elem);
        watcher.enterViewport(() => this.appendItems());
    },

});

