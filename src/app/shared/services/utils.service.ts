import { Injectable } from "@angular/core";
import Web3 from "web3";
import BigNumber from 'bignumber.js';

@Injectable({
    providedIn: 'root',
})

export class UtilsService {

    public toBN(value) {
        return new BigNumber(value);
    }

    public convertFrom(value: string) {
        return Web3.utils.fromWei(value);
    }

    public convertTo(value: string) {
        return Web3.utils.toWei(value);
    }

    public isDatePass(date: number) {
        let now = new Date();

        return new Date(date * 1000) < now;
    }

}
