import { AfterViewInit, Component, ElementRef, Input, OnInit, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';

@Component({
  selector: 'range-slider',
  templateUrl: './range-slider.component.html',
  styleUrls: ['./range-slider.component.scss']
})
export class RangeSliderComponent implements OnInit, AfterViewInit {
  @Input('maxValue') max:number = 100;
  @Input('minValue') min:number = 0;
  @Input('defaultMaxValue') defaultMaxValue:number = 80;
  @Input('defaultMinValue') defaultMinValue:number = 15;
  @Input('stepSize') stepSize: number = 1;
  @Input('minMaxGap') minMaxGap: number = 40;

  @ViewChild('rangeMinInput')
  rangeMinInputs!: ElementRef<HTMLInputElement>;
  @ViewChild('rangeMaxInput')
  rangeMaxInputs!: ElementRef<HTMLInputElement>;
  @ViewChild('range')
  range!: ElementRef<HTMLDivElement>;
  @ViewChild('boxLeft')
  boxLeft!: ElementRef<HTMLDivElement>;
  @ViewChild('boxRight')
  boxRight!: ElementRef<HTMLDivElement>;
  rangeInput = document.querySelectorAll(".range-input input");
  priceGap = this.minMaxGap;
  minInputValue: string = Math.ceil(this.defaultMinValue).toString(); // Bounded to "Min" input field 
  maxInputValue: string = Math.ceil(this.defaultMaxValue).toString(); // Bounded to "Max" input field

  constructor(
    private rend: Renderer2
  ) { }
  
  ngOnInit(): void {
  }
  ngAfterViewInit(): void {
    this.setRangeSlider(this.defaultMinValue, this.defaultMaxValue);
  }

  setRangeSlider(defaultMin:number, defaultMax:number){
    this.rend.setStyle(this.range.nativeElement, 'left', defaultMin+'%');
    this.rend.setStyle(this.range.nativeElement, 'right', (100-defaultMax)+'%');
    this.rend.setStyle(this.boxLeft.nativeElement, 'left', `calc(${defaultMin+'%'} - 0.8em)`);
    this.rend.setStyle(this.boxRight.nativeElement, 'right', `calc(${100-defaultMax+'%'} - 0.8em)`);
  }

  onMinInputPriceChange(event: KeyboardEvent): void{
    const eventTarget = event.target as HTMLInputElement;
    const value = Number(eventTarget.value); 
    this.minInputValue = eventTarget.value;
    let minValue = value;
    let maxValue = Number(this.maxInputValue)
    if((maxValue- minValue <= this.priceGap) && maxValue <= this.max){ 
      if(eventTarget.className === "input-min"){
        this.rend.setAttribute(this.rangeMinInputs, 'value', minValue.toString())
        this.rend.setStyle(this.range.nativeElement, 'left', (minValue + "%"))
        this.rend.setStyle(this.boxLeft.nativeElement, 'left', (minValue)+'%');
      }
    }
  }

  onMaxInputPriceChange(event: KeyboardEvent): void{
    const eventTarget = event.target as HTMLInputElement;
    const value = Number(eventTarget.value); 
    this.maxInputValue = eventTarget.value;
    let maxPrice = value;
    let minPrice = Number(this.minInputValue);
    this.maxInputValue = value.toString();
    if((maxPrice - minPrice >= this.priceGap) && maxPrice <= this.max){ 

    }else{
      this.rend.setAttribute(this.rangeMaxInputs, 'value', maxPrice.toString())
      this.rend.setStyle(this.range.nativeElement, 'right', (100 - (maxPrice / this.max) * 100) + "%");
      this.rend.setStyle(this.boxRight.nativeElement, 'right', (100-(maxPrice / this.max) * 100)+'%');
      
    }
  }

  onMinRangeChange(event: Event): void {
    const eventTarget = event.target as HTMLInputElement;
    const minValue = Number(eventTarget.value);
    const maxValue = Number(this.maxInputValue);
    if((maxValue- minValue >= this.priceGap)){ 
      const posLeft = (minValue/ this.max)*100;
      this.minInputValue = minValue.toString();
      this.rend.setStyle(this.range.nativeElement, 'left', ((minValue / this.max) * 100) + "%");
      this.rend.setStyle(this.boxLeft.nativeElement, 'left', `calc(${posLeft +'%'} - 0.8em`);
    }else {
      this.minInputValue = (maxValue - this.priceGap).toString();
      this.rend.setProperty(this.rangeMinInputs.nativeElement, "value", this.minInputValue)
      event.preventDefault()
    }
  }
  onMaxRangeChange(event: Event): void {
    const eventTarget = event.target as HTMLInputElement;
    const maxValue = Number(eventTarget.value);
    const minValue = Number(this.minInputValue);
    if((maxValue- minValue >= this.priceGap)){
      this.maxInputValue = (maxValue).toString();
      this.rend.setStyle(this.range.nativeElement, 'right', 100-((maxValue / this.max)) * 100 + "%");
      this.rend.setStyle(this.boxRight.nativeElement, 'right', `calc(${100-(maxValue / this.max) * 100+'%'} - 1em`);
    }else {
      this.maxInputValue = (minValue + this.priceGap).toString();

      this.rend.setProperty(this.rangeMaxInputs.nativeElement, "value", this.maxInputValue)
      event.preventDefault()
    }
  }
}
