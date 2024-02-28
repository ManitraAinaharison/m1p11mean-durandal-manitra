import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

interface TooltipConfig {
    show: boolean;
    text: string;
    position?: 'top' | 'right' | 'bottom' | 'left';
}

@Directive({
    selector: '[tooltip]',
    standalone: true,
})
export class TooltipDirective {

    @Input() tooltipConfig: TooltipConfig = {
        show: true,
        text: "",
        position: "top"
    };
    tooltipElement: HTMLDivElement | null = null;

    constructor(
        private elementRef: ElementRef,
        private renderer: Renderer2
    ) {}

    @HostListener('mouseenter') onMouseEnter() {
        if (this.tooltipConfig.show) this.showTooltip();
    }

    @HostListener('mouseleave') onMouseLeave() {
      if (this.tooltipConfig.show) this.hideTooltip();
    }

    private showTooltip() {
        if (!this.tooltipConfig.text || this.tooltipConfig.text == "") return;

        this.elementRef.nativeElement.classList.add("relative");
        this.tooltipElement = this.renderer.createElement('div');
        this.renderer.addClass(this.tooltipElement, 'tooltip');
        this.renderer.addClass(this.tooltipElement, `tooltip-${this.tooltipConfig.position}`);
        this.renderer.appendChild(this.tooltipElement, this.renderer.createText(this.tooltipConfig.text));
        this.renderer.appendChild(this.elementRef.nativeElement, this.tooltipElement);
    }

    private hideTooltip() {
        if (this.tooltipElement) {
          this.elementRef.nativeElement.classList.remove("relative");
            this.renderer.removeChild(this.elementRef.nativeElement, this.tooltipElement);
            this.tooltipElement = null;
        }
    }
}
