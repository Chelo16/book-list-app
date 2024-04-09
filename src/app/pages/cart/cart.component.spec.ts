import { CartComponent } from "./cart.component";
import {ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { BookService } from "src/app/services/book.service";
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement, NO_ERRORS_SCHEMA } from "@angular/core";
import { Book } from "src/app/models/book.model";
import { By } from "@angular/platform-browser";

const listBook: Book[]= [
    {
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
describe('Cart Component',()=>{
    let component: CartComponent;
    let fixture: ComponentFixture<CartComponent>;

    beforeEach(()=>{
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule
            ],
            declarations: [
                CartComponent
            ],
            providers:[
                BookService
            ],
            schemas:[CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
        }).compileComponents();
    });

    beforeEach(()=>{
        fixture = TestBed.createComponent(CartComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        const service = fixture.debugElement.injector.get(BookService);
        spyOn(service,'getBooksFromCart').and.callFake(()=>listBook);

    })
    it('should create',()=>{
        expect(component).toBeTruthy();
    })

    it('getTotalPrice return an amount',()=>{
        const totalPrice = component.getTotalPrice(listBook);
        expect(totalPrice).toBeGreaterThan(0);
        expect(totalPrice).not.toBeNull();
    });
    // public onInputNumberChange(action: string, book: Book): void {
    //     const amount = action === 'plus' ? book.amount + 1 : book.amount - 1;
    //     book.amount = Number(amount);
    //     this.listCartBook = this._bookService.updateAmountBook(book);
    //     this.totalPrice = this.getTotalPrice(this.listCartBook);
    //   }

    it('onInputNumberChange increments correctly',()=>{
        const action = 'plus';
        const book = {name: '',
            author: '',
            isbn: '',
            price: 15,
            amount: 2
        };
        const service = fixture.debugElement.injector.get(BookService);
        
        expect(book.amount).toBe(2);
        const spy1 = spyOn(service, 'updateAmountBook').and.callFake(()=>null);
        const spy2 =spyOn(component, 'getTotalPrice').and.callFake(()=>null);

        component.onInputNumberChange(action,book);
        expect(book.amount).toBe(3);
        expect(spy1).toHaveBeenCalled();
        expect(spy2).toHaveBeenCalled();
        
    })

    it('onInputNumberChange dicrements correctly',()=>{
        const action = 'minus';
        const book = {name: '',
                author: '',
                isbn: '',
                price: 15,
                amount: 2
            };

        const service = fixture.debugElement.injector.get(BookService);
        expect(book.amount).toBe(2);
        const spy1 = spyOn(service, 'updateAmountBook').and.callFake(()=>null);
        const spy2 =spyOn(component, 'getTotalPrice').and.callFake(()=>null);

        component.onInputNumberChange(action,book);
        expect(book.amount).toBe(1);
        expect(spy1).toHaveBeenCalled();
        expect(spy2).toHaveBeenCalled();
    })
    
    it('_clearListCartBook works correctly',()=>{
        const service = fixture.debugElement.injector.get(BookService);
        const spy1 = spyOn((component as any), '_clearListCartBook').and.callThrough();
        const spy2 = spyOn(service,'removeBooksFromCart').and.callFake(()=>null);
        component.listCartBook = listBook;
        component.onClearBooks();
        expect(component.listCartBook.length).toBe(0);
        expect(spy1).toHaveBeenCalled();
        expect(spy2).toHaveBeenCalled();
    });

    it('The title "The car was empty" doesnt display anything', () => {
        component.listCartBook  = listBook;
        fixture.detectChanges();
        const debugElement: DebugElement = fixture.debugElement.query( By.css('#titleCartEmpty'));
        expect(debugElement).toBeFalsy();
    });

    it('The title "The car was empty" display correctly when the list is empty', () => {
        component.listCartBook  = [];
        fixture.detectChanges();
        const debugElement: DebugElement = fixture.debugElement.query( By.css('#titleCartEmpty'));
        expect(debugElement).toBeTruthy();
        if(debugElement){
            const element: HTMLElement = debugElement.nativeElement;
            expect(element.innerHTML).toContain("The cart is empty");
        }
    });
    

})