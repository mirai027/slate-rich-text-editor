// This example is for an Editor with `ReactEditor` and `HistoryEditor`
import { BaseEditor } from 'slate'
import { ReactEditor } from 'slate-react'
import { HistoryEditor } from 'slate-history'

export type CodeElement = {
  type: 'code'
  children: CustomText[]
}

export type ParagraphElement = {
  type: 'paragraph'
  children: CustomText[]
}

type CustomElement = CodeElement | ParagraphElement
type CustomText = { text: string; bold?: true }

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & HistoryEditor
    Element: CustomElement
    Text: CustomText
  }
}
