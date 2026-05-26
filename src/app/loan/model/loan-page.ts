import { Pageable } from "../../core/model/page/Pageable";
import {Loan} from "./loan"

export class LoanPage {
    content!: Loan[];
    pageable!: Pageable;
    totalElements!: number;
    totalPages!: number;
}