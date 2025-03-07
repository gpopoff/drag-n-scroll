import { AfterViewInit, Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { throttle } from 'lodash';

@Directive({
    selector: '[mouseDragScroll]'
})
export class MouseDragScrollDirective implements AfterViewInit {
    private isMouseDown = false;
    private startX = 0;
    private scrollLeft = 0;
    private canScroll = false;

    constructor(private el: ElementRef, private renderer: Renderer2) {
        this.throttledMouseMove = throttle(this.onMouseMoveInternal.bind(this), 16); // ~60 FPS
    }

    ngAfterViewInit(): void {
        this.updateScrollability();
    }

    @HostListener('window:resize')
    onResize(): void {
        this.updateScrollability();
    }

    @HostListener('mousedown', ['$event'])
    onMouseDown(event: MouseEvent): void {
        if (!this.canScroll || this.isNonDraggableTarget(event)) return;

        // Deselect any user-selected text
        const selection = window.getSelection();
        if (selection) {
            selection.removeAllRanges();
        }

        // Prevent text selection and initiate drag
        event.preventDefault();
        this.isMouseDown = true;
        this.startX = event.pageX - this.el.nativeElement.offsetLeft;
        this.scrollLeft = this.el.nativeElement.scrollLeft;
        this.renderer.addClass(this.el.nativeElement, 'user-select-disable');
    }

    @HostListener('mouseup')
    @HostListener('mouseleave')
    onMouseUpOrLeave(): void {
        if (this.isMouseDown) {
            this.isMouseDown = false;
            this.renderer.removeClass(this.el.nativeElement, 'user-select-disable');
        }
    }

    @HostListener('mousemove', ['$event'])
    onMouseMove(event: MouseEvent): void {
        if (!this.isMouseDown || !this.canScroll) return;

        this.throttledMouseMove(event);
    }

    private onMouseMoveInternal(event: MouseEvent): void {
        const x = event.pageX - this.el.nativeElement.offsetLeft;
        const walk = (x - this.startX) * 1; // Adjust the multiplier for faster/slower scroll
        requestAnimationFrame(() => {
            this.el.nativeElement.scrollLeft = this.scrollLeft - walk;
        });
    }

    private updateScrollability(): void {
        const container = this.el.nativeElement;
        const isScrollable = container.scrollWidth > container.clientWidth;

        if (this.canScroll !== isScrollable) {
            this.canScroll = isScrollable;
            if (isScrollable) {
                this.renderer.addClass(container, 'draggable');
            } else {
                this.renderer.removeClass(container, 'draggable');
            }
        }
    }

    private isNonDraggableTarget(event: MouseEvent): boolean {
        return (event.target as HTMLElement).closest('.non-draggable') !== null;
    }

    private throttledMouseMove: (event: MouseEvent) => void;
}
