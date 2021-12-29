"use strict";(self.webpackChunk_1inch_transaction_decoder=self.webpackChunk_1inch_transaction_decoder||[]).push([[592],{5633:(v,m,n)=>{n.d(m,{T:()=>j});var t=n(5e3),i=n(3075),g=n(9014),u=n(5628),c=n(4420),d=n(2722),h=n(5698),s=n(9300),p=n(2307),_=n(6693);let C=(()=>{class r{constructor(o,e,a){this.dialogService=o,this.context=e,this.fb=a,this.form=this.fb.group({json:[]}),this.jsonEditorOptions=new c.Rc,this.jsonEditorOptions.mode="code",this.jsonEditorOptions.statusBar=!1,this.context.data&&this.form.setValue({json:this.context.data},{emitEvent:!1})}close(){this.context.completeWith()}save(){var o;this.form.invalid||this.context.completeWith(null===(o=this.form.get("json"))||void 0===o?void 0:o.value)}}return r.\u0275fac=function(o){return new(o||r)(t.Y36(p.RO),t.Y36(u.yf),t.Y36(i.qu))},r.\u0275cmp=t.Xpm({type:r,selectors:[["app-json-in-modal"]],decls:7,vars:2,consts:[[1,"modal-container",3,"formGroup","ngSubmit"],["formControlName","json",1,"json-editor",3,"options"],[1,"actions"],["tuiButton","","type","button",1,"decoder-btn","cancel",3,"click"],["tuiButton","","type","submit",1,"decoder-btn"]],template:function(o,e){1&o&&(t.TgZ(0,"form",0),t.NdJ("ngSubmit",function(){return e.save()}),t._UZ(1,"json-editor",1),t.TgZ(2,"div",2),t.TgZ(3,"button",3),t.NdJ("click",function(){return e.close()}),t._uU(4,"Cancel"),t.qZA(),t.TgZ(5,"button",4),t._uU(6,"Save"),t.qZA(),t.qZA(),t.qZA()),2&o&&(t.Q6J("formGroup",e.form),t.xp6(1),t.Q6J("options",e.jsonEditorOptions))},directives:[i._Y,i.JL,i.sg,c.TO,i.JJ,i.u,_.v0],styles:[".modal-container[_ngcontent-%COMP%]{background:var(--1inch-bg-02);width:500px;min-height:700px;border-radius:24px;padding:10px}.json-editor[_ngcontent-%COMP%]{display:block;margin-bottom:16px}.json-editor[_ngcontent-%COMP%]     .jsoneditor-mode-code{border:none}.json-editor[_ngcontent-%COMP%]     div.jsoneditor-outer{margin-top:0;padding-top:0}.json-editor[_ngcontent-%COMP%]     div.jsoneditor-menu{display:none}.json-editor[_ngcontent-%COMP%]     .ace_editor{min-height:650px;border-radius:10px}.json-editor[_ngcontent-%COMP%]     .ace-jsoneditor .ace_cursor{border-color:var(--1inch-common-text-01)}.json-editor[_ngcontent-%COMP%]     .ace_content, .json-editor[_ngcontent-%COMP%]     .ace_gutter-layer{background:var(--1inch-bg-02)}.json-editor[_ngcontent-%COMP%]     .ace_folding-enabled>.ace_gutter-cell{color:var(--1inch-common-text-01)}.json-editor[_ngcontent-%COMP%]     .ace_layer .ace_text-layer{background:white}.json-editor[_ngcontent-%COMP%]     .ace_selection{opacity:.2;background:var(--1inch-text-10)!important}.json-editor[_ngcontent-%COMP%]     .ace_text-layer{color:var(--1inch-common-text-01)}.json-editor[_ngcontent-%COMP%]     .ace_variable{color:var(--1inch-common-text-09)}.json-editor[_ngcontent-%COMP%]     .ace_active-line{opacity:.1}.json-editor[_ngcontent-%COMP%]     .ace-jsoneditor .ace_string{color:var(--1inch-common-text-07)}.actions[_ngcontent-%COMP%]{display:flex;justify-content:flex-end;margin-top:16px}.decoder-btn[_ngcontent-%COMP%]{display:flex;justify-content:center;align-items:center;white-space:pre-line;background:var(--1inch-common-btn-bg-01);color:var(--text-white);border-radius:12px!important;padding:7px 10px!important;min-height:40px;font-size:16px;line-height:26px!important}.decoder-btn.cancel[_ngcontent-%COMP%]{margin-right:8px;background:var(--1inch-common-btn-bg-07)}.decoder-btn[_ngcontent-%COMP%]:hover{background:var(--bg-accentBlue-hover);color:var(--text-white)}"],changeDetection:0}),r})();var O=n(4620);let j=(()=>{class r{constructor(o,e,a){this.dialogService=o,this.injector=e,this.onDestroy$=a,this.control=new i.NI({}),this.jsonEditorOptions=new c.Rc,this.jsonEditorOptions.mode="code",this.jsonEditorOptions.statusBar=!1}set value(o){this.control.setValue(o=null!=o?o:{})}set disabled(o){this.setDisabledState(o)}onChanged(o){}onTouched(){}ngOnInit(){this.control.valueChanges.pipe((0,d.R)(this.onDestroy$)).subscribe({next:o=>this.onChanged(o)})}registerOnChange(o){this.onChanged=o}registerOnTouched(o){this.onTouched=o}validate(o){return o.valid?null:{jsonInvalid:!0}}writeValue(o){this.control.setValue(o,{emitEvent:!1})}setDisabledState(o){const e={emitEvent:!1};o?this.control.disable(e):this.control.enable(e)}openInModal(){this.dialogService.open(new u.Al(C,this.injector),{data:Object.assign({},this.control.value)}).pipe((0,h.q)(1),(0,s.h)(Boolean),(0,d.R)(this.onDestroy$)).subscribe({next:o=>{this.control.setValue(o)}})}}return r.\u0275fac=function(o){return new(o||r)(t.Y36(p.RO),t.Y36(t.zs3),t.Y36(g.a3))},r.\u0275cmp=t.Xpm({type:r,selectors:[["app-json-editor"]],inputs:{value:"value",disabled:"disabled"},features:[t._Bn([{provide:i.JU,useExisting:(0,t.Gpc)(()=>r),multi:!0},{provide:i.Cf,useExisting:r,multi:!0},g.a3])],decls:3,vars:2,consts:[[1,"open-full-container",3,"click"],["src","tuiIconCode",1,"open-full"],[1,"json-editor",3,"formControl","options"]],template:function(o,e){1&o&&(t.TgZ(0,"div",0),t.NdJ("click",function(){return e.openInModal()}),t._UZ(1,"tui-svg",1),t.qZA(),t._UZ(2,"json-editor",2)),2&o&&(t.xp6(2),t.Q6J("formControl",e.control)("options",e.jsonEditorOptions))},directives:[O.P,c.TO,i.JJ,i.oH],styles:["[_nghost-%COMP%]{position:relative;display:block}[_nghost-%COMP%]   .open-full-container[_ngcontent-%COMP%]{position:absolute;top:20px;right:20px;z-index:3;background:var(--1inch-btn-bg-01);border-radius:8px;cursor:pointer}[_nghost-%COMP%]   .open-full-container[_ngcontent-%COMP%]   .open-full[_ngcontent-%COMP%]{color:var(--1inch-text-01)}.json-editor[_ngcontent-%COMP%]{display:block;margin-bottom:16px}.json-editor[_ngcontent-%COMP%]     div.jsoneditor-outer{margin-top:0;padding-top:0}.json-editor[_ngcontent-%COMP%]     div.jsoneditor-menu{display:none}.json-editor[_ngcontent-%COMP%]     .ace_editor{min-height:350px}.json-editor[_ngcontent-%COMP%]     .ace-jsoneditor .ace_cursor{border-color:var(--1inch-common-text-01)}.json-editor[_ngcontent-%COMP%]     .ace_content, .json-editor[_ngcontent-%COMP%]     .ace_gutter-layer{background:var(--1inch-bg-02)}.json-editor[_ngcontent-%COMP%]     .ace_folding-enabled>.ace_gutter-cell{color:var(--1inch-common-text-01)}.json-editor[_ngcontent-%COMP%]     .ace_layer .ace_text-layer{background:white}.json-editor[_ngcontent-%COMP%]     .ace_selection{opacity:.2;background:var(--1inch-text-10)!important}.json-editor[_ngcontent-%COMP%]     .ace_text-layer{color:var(--1inch-common-text-01)}.json-editor[_ngcontent-%COMP%]     .ace_variable{color:var(--1inch-common-text-09)}.json-editor[_ngcontent-%COMP%]     .ace_active-line{opacity:.1}.json-editor[_ngcontent-%COMP%]     .ace-jsoneditor .ace_string{color:var(--1inch-common-text-07)}"],changeDetection:0}),r})()},2573:(v,m,n)=>{n.d(m,{_:()=>h});var t=n(9808),i=n(3075),g=n(4620),u=n(6693),c=n(4420),d=n(5e3);let h=(()=>{class s{}return s.\u0275fac=function(_){return new(_||s)},s.\u0275mod=d.oAB({type:s}),s.\u0275inj=d.cJS({imports:[[t.ez,c.hP,g.E,u.fN,i.UX]]}),s})()}}]);