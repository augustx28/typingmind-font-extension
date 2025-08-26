(function() {
    'use strict';

    const customCSS = `
        /* var(  workspace height) */
        #nav-handler .transition .h-\\[var\\(--workspace-height\\)\\]{
         background-color:#191919;
         width:72px;
        }

        /* Division */
        .transition div .md\\:max-w-\\[calc\\(var\\(--sidebar-width\\)-var\\(--workspace-width\\)\\)\\]{
         background-color:#191919;
        }

        /* workspace color */
        .transition div .bg-\\[--workspace-color\\]{
         background-color:#191919;
        }

        /* Division */
        .h-\\[var\\(--workspace-height\\)\\] .sm\\:block .md\\:flex-col{
         border-width:0px;
         border-color:#474747;
         border-top-left-radius:9px;
         border-top-right-radius:9px;
         border-bottom-left-radius:9px;
         border-bottom-right-radius:9px;
         background-color:rgba(76,76,76,0);
         height:797px;
         position:relative;
         top:9px;
         transform:translatex(0px) translatey(0px);
         width:100% !important;
        }

        /* Division */
        .min-h-full .w-full .flex-col .flex .flex > div{
         color:rgba(255,255,255,0.46);
        }

        /* Italic Tag */
        .pb-8 .flex i{
         color:rgba(255,255,255,0.46);
        }

        .md\\:max-w-\\[calc\\(var\\(--sidebar-width\\)-var\\(--workspace-width\\)\\)\\] div .\\!flex{
         border-color:#3a3a3a;
        }

        /* Svg */
        .md\\:max-w-\\[calc\\(var\\(--sidebar-width\\)-var\\(--workspace-width\\)\\)\\] div .h-6{
         color:#da9010;
        }

        /* Text amber 400 */
        .\\!flex div .text-amber-400{
         color:#fa8423;
        }

        /* Text amber 400 */
        .pb-8 div .text-amber-400{
         color:#fa8423;
        }

        .bg-\\[--workspace-color\\] .flex > .w-full{
         font-size:15px;
        }

        /* Full */
        .bg-\\[--workspace-color\\] > .flex > .w-full{
         border-top-left-radius:12px;
         border-top-right-radius:12px;
         border-bottom-left-radius:12px;
         border-bottom-right-radius:12px;
         width:232px;
         color:#db801d;
        }

        /* Svg */
        .h-\\[var\\(--workspace-height\\)\\] .focus\\:text-white:nth-child(1) .w-4{
         color:#8a5cf3;
        }

        /* Svg */
        .h-\\[var\\(--workspace-height\\)\\] .focus\\:text-white:nth-child(2) .w-4{
         color:rgba(253,117,6,0.7);
        }

        /* Svg */
        .h-\\[var\\(--workspace-height\\)\\] .focus\\:text-white:nth-child(3) .w-4{
         color:rgba(188,30,70,0.7);
        }

        /* Svg */
        .h-\\[var\\(--workspace-height\\)\\] .focus\\:text-white:nth-child(4) .w-4{
         color:rgba(0,197,174,0.7);
        }

        /* Svg */
        .h-\\[var\\(--workspace-height\\)\\] .focus\\:text-white:nth-child(5) .w-4{
         color:rgba(96,139,255,0.89);
        }

        /* Svg */
        .h-\\[var\\(--workspace-height\\)\\] .flex-col .w-5{
         color:#707070 !important;
        }

        /* Svg */
        .h-\\[var\\(--workspace-height\\)\\] .focus\\:text-white:nth-child(9) .w-4{
         color:rgba(170,170,170,0.7);
        }

        .transition .h-\\[var\\(--workspace-height\\)\\] .sm\\:block{
         width:60px;
        }

        /* Svg */
        .h-\\[var\\(--workspace-height\\)\\] .flex-col .w-4{
         color:#707070 !important;
        }

        /* Svg */
        #__next .custom-theme #nav-handler .transition .h-\\[var\\(--workspace-height\\)\\] .sm\\:block .md\\:flex-col .focus\\:text-white .flex-col .w-4{
         color:#707070 !important;
        }

        /* NEW -- Disable Chat Hover Color Change */
        a[href*="/chat/"]:hover {
            background-color: transparent !important;
        }
    `;

    const style = document.createElement('style');
    style.textContent = customCSS;
    document.head.append(style);
})();
