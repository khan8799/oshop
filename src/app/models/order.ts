export class Order {
    datePlaced: number;

    constructor(public userId: string, public shipping: any, public shoppingCart) {
        this.datePlaced = new Date().getTime();
    }
}