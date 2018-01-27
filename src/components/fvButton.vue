<template lang="pug">
button.fv-button(:class="{'loading': loading}", @click="onClick", :disabled="disabled || loading")
  i(:class="icon", v-if="icon && !loading")
  =" "
  slot(v-if="typeof text === 'undefined' && !loading")
  span(v-else-if="!loading",
    v-html="text")
  i.loading-icon.fa.fa-spin.fa-circle-o-notch.fv-fast-animation(v-else)
</template>

<script>
export default {
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    icon: {
      default: ''
    },
    text: {
      default: undefined
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    onClick (e) {
      if (!this.loading && !this.disabled) {
        this.$emit('click', e)
      }
    }
  }
}
</script>

<style lang="scss">
@import '../styles/variables';
@import '../styles/functions';
@import '../styles/mixins';

@mixin button($bgcolor, $color: false) {
  $bgcolor-dark: darken($bgcolor, $shadow-percent);

  background: $bgcolor; //linear-gradient(to top, $bgcolor-dark, $bgcolor 10%);
  border: 1px solid $bgcolor-dark;

  @if $color == false {
    color: yiq($bgcolor);
  }

  @else {
    color: $color;
  }

  &:active,
  &.active {
    background: $bgcolor-dark; //linear-gradient(to bottom, $bgcolor-dark, $bgcolor 25%);
  }

  &:focus,
  &.focus {
    @include outline;

    &:invalid,
    &.invalid {
      @include outline($danger-color);
    }
  }

  &[disabled],
  &.disabled {
    @include disabled;
  }
}

.fv-button {
  @include sizes;

  border-radius: $border-radius;
  cursor: pointer;
  display: inline-block;
  font-family: inherit;
  max-width: 100%;
  text-align: center;
  vertical-align: middle;

  &,
  & span {
    @include nowrap;
  }

  &,
  &.fv-default {
    @include button($default-color);
  }

  &.fv-ok {
    @include button($default-color, $primary-color);
  }

  &.fv-primary {
    @include button($primary-color);
  }

  &.fv-info {
    @include button($info-color);
  }

  &.fv-danger {
    @include button($danger-color);
  }

  &.fv-warning {
    @include button($warning-color);
  }
}
</style>