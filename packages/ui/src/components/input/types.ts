import type { InputTypeHTMLAttribute } from 'vue'

export interface InputProps {
  placeholder?: string
  error?: boolean
  disabled?: boolean
  type?: InputTypeHTMLAttribute
  class?: string
}