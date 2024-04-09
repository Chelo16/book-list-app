import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { BookService } from "./book.service";
import { TestBed } from "@angular/core/testing";
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from "@angular/core";
import { Book } from "../models/book.model";
import { environment } from "src/environments/environment.prod";
import swal from 'sweetalert2';

const listBook: Book[]= [
    {
        id: '1',
        name: '',
        author: '',
        isbn: '',
        price: 15,
        amount: 2
    },
    {
        name: '',
        author: '',
        isbn: '',
        price: 20,
        amount: 1
    },
    {
        name: '',
        author: '',
        isbn: '',
        price: 8,
        amount: 2
    }
]

const book : Book = {
    id:'1',
    name: '',
    author: '',
    isbn: '',
    price: 15,
    amount: 2
}
const book2 : Book = {
    id:'2',
    name: '',
    author: '',
    isbn: '',
    price: 15,
    amount: 2
}
describe('BookService', ()=>{
    let service: BookService;
    let httpMock : HttpTestingController;
    let storage = {};

    beforeEach(()=>{
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule
            ],
            providers:[
                BookService
            ],
            schemas:[CUSTOM_ELEMENTS_SCHEMA,NO_ERRORS_SCHEMA]
        });
    });

    beforeEach(()=>{
        service = TestBed.inject(BookService);
        httpMock = TestBed.inject(HttpTestingController);
        storage = {};
        spyOn(localStorage, 'getItem').and.callFake((key: string) =>{
            return storage[key]? storage[key] : null;
        })

        spyOn(localStorage, 'setItem').and.callFake((key:string, value:string)=>{
            return storage[key] = value;
        })
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    
    it('getBook return a list of book and does a get method', () => {
        service.getBooks().subscribe((resp: Book[])=>{
            expect(resp).toEqual(listBook);
        });

        const req = httpMock.expectOne(environment.API_REST_URL + '/book');
        expect(req.request.method).toBe('GET');
        req.flush(listBook);
    });

    it('getsBookFromCart return empty when localStorage is empty', () => {
        const listBook = service.getBooksFromCart();

        expect(listBook.length).toBe(0);
    });
    
    it('addBookToCart add a book when the list doesn´t exists in localStorage', () => {
        const toast = {
            fire:() => null
        } as any;
        const spy1 = spyOn(swal, 'mixin').and.callFake(()=>{
            return toast;
        });
        let listBook =service.getBooksFromCart();
        expect(listBook.length).toBe(0);
        service.addBookToCart(book);
        listBook  = service.getBooksFromCart();
        service.addBookToCart(book2);
        listBook  = service.getBooksFromCart();
        expect(listBook.length).toBe(2);
    });
    
    it('removeBooksFromCart remove the list from storage', () => {
        service.addBookToCart(book);
        let listBook = service.getBooksFromCart();
        expect(listBook.length).toBe(1);
        service.removeBooksFromCart();
        listBook = service.getBooksFromCart();
        expect(listBook.length).toBe(0);
    });
    
    // public updateAmountBook(book: Book): Book[] {
    //     const listBookCart = this.getBooksFromCart();
    //     const index = listBookCart.findIndex((item: Book) => {
    //       return book.id === item.id;
    //     });
    //     if (index !== -1) {
    //       listBookCart[index].amount = book.amount;
    //       if (book.amount === 0) {
    //         listBookCart.splice(index, 1);
    //       }
    //     }
    //     localStorage.setItem('listCartBook', JSON.stringify(listBookCart));
    //     return listBookCart;
    //   }
    
    it('updateAmountBook works correctly', () => {
        let listBook = service.getBooksFromCart();
        service.addBookToCart(book);
        service.updateAmountBook(book);
        listBook = service.getBooksFromCart();
        expect(listBook[0].amount).toBe(1);
    });
    
    
});