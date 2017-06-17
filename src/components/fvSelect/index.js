import utility from '../../utility'
import template from './template.pug'
export default ({
    template: template,
    data(){
        return {
            pValue: null,
            pShow: false,
            searchQuery: '',
            highlightedOption: 0,
            dialogButtons: [
                {
                    key: 'reset',
                    icon: 'fa fa-circle-o',
                    text: 'حذف انتخاب',
                    class: 'fv-default'
                },
                {
                    key: 'ok',
                    icon: 'fa fa-check',
                    text: 'باشه',
                    class: 'fv-primary'
                }
            ]
        }
    },
    props: {
        options: {
            type: Array,
            default: () => []
        },
        inputClass: {
            default: ''
        },
        dialogClass: {
            default: ''
        },
        value: {
            default: null
        },
        multiple: {
            type: Boolean,
            default: false
        },
        required: {
            type: Boolean,
            default: false
        },
        disabled: {
            type: Boolean,
            default: false
        },
        search: {
            type: Boolean,
            default: true
        },
        placeholder: {
            type: String,
            default : ''
        },
        allowInsert: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        open: function(){
            this.searchQuery = '';
            this.$refs.dialog.open();
        },
        close: function(){
            this.$refs.dialog.close();
        },
        highlightOption: function(option={index:null}){
            this.highlightedOption = option.index;
        },
        pFocus: function(el="input"){
            if( el == 'input' ){
                this.$refs.inputEl.$el.focus();
            }
            else{
                if( this.search || this.allowInsert ){
                    this.$refs.searchQueryEl.$el.focus();
                    
                }
                else{
                    this.$refs.dialog.pFocus();
                }
            }
        },
        pSetValue: function(value, emit=true){
            this.pValue = value;
            if( emit ){
                this.$emit('input', value);
                this.$emit('change');
            }
        },
        pIsSelected: function(option={index:null,value:null}){
            if( this.multiple && typeof this.pValue === 'object' && this.pValue !== null){
                return this.pValue.indexOf( option.value ) !== -1;
            }
            else{
                return this.pValue === option.value;
            }
        },
        pKeyDown: function(event){
            switch(event.which){
                case 38: //up
                    this.highlightedOption = this.highlightedOption == null? this.pOptions.length: this.highlightedOption;
                    this.highlightedOption = this.highlightedOption-1 < 0? this.pOptions.length-1: this.highlightedOption-1;
                    break;
                case 40: // down
                    this.highlightedOption = this.highlightedOption == null? -1: this.highlightedOption;
                    this.highlightedOption = this.highlightedOption+1 >= this.pOptions.length? 0: this.highlightedOption+1;
                    break;
                case 37: case 39: //left, right
                    break;
                case 13: // enter
                    if( this.highlightedOption !== null ){
                        this.clickOption( this.pOptions[ this.highlightedOption ], true );
                    }
                    if( event.target.tagName == 'BUTTON' ){
                        event.preventDefault();
                        event.target.click();
                    }
                    break;
            }        
        },
        clickOption: function(option={index:null,value:null, key:'select'}, setHighlight = false){
            if( option.disabled || option.key == 'none' ){
                return;
            }
            if(setHighlight){
                this.highlightOption( option );
            }
            else{
                this.highlightOption();
            }
            if( option.value === null ){
                if( this.multiple ){
                    this.pSetValue( [] );
                }
                else{
                    this.pSetValue( null );
                }
            }
            else if( this.allowInsert && option.key === 'insert' ){
                let newValue = this.pValue;
                if( this.multiple ){
                    newValue.push( option.value );
                }
                else{
                    newValue = option.value;
                }
                this.$emit('insert', option.value);
                this.pSetValue( newValue );
            }
            else if( this.multiple ){
                let newValue = this.pValue;
                if( this.pIsSelected(option) ){
                    newValue.splice( newValue.indexOf(option.value) , 1);
                }
                else{
                    newValue.push( option.value );
                }
                this.pSetValue( newValue );
            }
            else{
                this.pSetValue( option.value );
            }
            this.searchQuery = '';
        },
        clickButton: function(action){
            switch(action){
                case 'reset':
                    this.clickOption();
                default:
                    this.close();
            }
        },
        setStructure: function(){
            if( this.multiple ){
                if( !this.value || this.value.constructor !== Array ){
                    this.pSetValue( [] );
                }
                else{
                    this.pSetValue( this.value, false );
                }
            }
            else{
                this.pSetValue( this.value, false );
            }
        }
    },
    created: function(){
        this.setStructure();
    },
    mounted: function(){
    },
    computed: {
        mOptions: function(){
            const mOptions = this.options;
            if( this.pValue !== null ){
                if( this.multiple === true ){
                    this.pValue.forEach( (value,index)=>{
                        const founded = mOptions.find((v) => v.value == value);
                        if( !founded ){
                            mOptions.unshift({
                                text: value,
                                value: value
                            });
                        }
                    });
                }
            }
            return mOptions;
        },
        pOptions: function(){
            let ret = [];

            this.mOptions.forEach( (option,index)=>{
                let text = typeof option == 'object' && option !== null? option.text: option;
                let value = typeof option == 'object' && option !== null? option.value: option;
                let disabled = typeof option == 'object' && option !== null? option.disabled || false: false;
                let selected = this.pIsSelected({value});
                if(
                    utility.contains(text, this.searchQuery) ||
                    utility.contains(value, this.searchQuery)
                ){
                    ret.push({
                        text: text,
                        value: value,
                        highlighted: this.highlightedOption === index,
                        disabled: disabled,
                        selected: selected,
                        key: 'select',
                        index: index,
                    });
                }
            });
            let index = ret.length;
            if( this.allowInsert === true && this.searchQuery.length > 0){
                ret.push({
                    text: `اضافه کردن "${this.searchQuery}"`,
                    value: this.searchQuery,
                    highlighted: this.highlightedOption === index,
                    key: 'insert',
                    index: index++,
                });
            }
            if( ret.length === 0 ){
                ret.push({
                    text: 'چیزی پیدا نشد!',
                    value: null,
                    highlighted: this.highlightedOption === index,
                    key: 'none',
                    index: index++,
                });
            }
            return ret;
        },
        displayValue: function(){
            const ret = [];
            const value = this.pValue;
            const mOptions = this.mOptions;
            function getText(value){
                const founded = mOptions.find((v) => v.value == value);
                if( founded ){
                    return founded.text;
                }
                else{
                    return value;
                }
            }

            if( value === null ){
                return [];
            }
            else{
                if( this.multiple ){
                    this.pValue.forEach( (value,index)=>{
                        ret.push( getText(value) );
                    });
                }
                else{
                    ret.push( getText(this.pValue) );
                }
            }
            return ret;
        }
    },
    watch: {
        searchQuery: function(){
            this.highlightedOption = this.pOptions.length > 0? 0: null;
        },
        value: function(){
            this.setStructure();
        }
    }
})