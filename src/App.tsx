import { useCallback, useMemo, useState } from 'react'
import { createEditor, Descendant, Transforms, Editor, Element } from 'slate'

import {
  Slate,
  Editable,
  withReact,
  ReactEditor,
  RenderElementProps,
  RenderLeafProps,
} from 'slate-react'

const App = () => {
  const [editor] = useState<ReactEditor>(() => withReact(createEditor()))

  const initialValue: Descendant[] = useMemo(
    () =>
      JSON.parse(localStorage.getItem('content') || 'null') || [
        {
          type: 'paragraph',
          children: [{ text: 'A line of text in a paragraph.' }],
        },
      ],
    []
  )

  const renderElement = useCallback((props: RenderElementProps) => {
    switch (props.element.type) {
      case 'code':
        return <CodeElement {...props} />
      default:
        return <DefaultElement {...props} />
    }
  }, [])

  const renderLeaf = useCallback((props: RenderLeafProps) => {
    return <Leaf {...props} />
  }, [])

  return (
    <Slate
      editor={editor}
      initialValue={initialValue}
      onChange={(value) => {
        const isAstChange = editor.operations.some(
          (op) => 'set_selection' !== op.type
        )
        // 检查 editor.operations 来判断是否是实际的 AST（抽象语法树）更改，而不是仅仅是光标的移动（set_selection 操作）
        if (isAstChange) {
          const content = JSON.stringify(value)
          localStorage.setItem('content', content)
        }
      }}
    >
      <Editable
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        onKeyDown={(event) => {
          if (!event.ctrlKey) {
            return
          }

          switch (event.key) {
            case '`': {
              event.preventDefault()
              const [match] = Editor.nodes(editor, {
                match: (n) => n.type === 'code',
              })
              Transforms.setNodes(
                editor,
                { type: match ? 'paragraph' : 'code' },
                {
                  match: (n) =>
                    Element.isElement(n) && Editor.isBlock(editor, n),
                }
              )
              break
            }

            case 'b': {
              event.preventDefault()
              const isBold = Editor.marks(editor)?.bold
              if (isBold) {
                Editor.removeMark(editor, 'bold')
              } else {
                Editor.addMark(editor, 'bold', true)
              }
              break
            }
          }
        }}
      />
    </Slate>
  )
}

const CodeElement = (props: RenderElementProps) => {
  return (
    <pre {...props.attributes}>
      <code>{props.children}</code>
    </pre>
  )
}

const DefaultElement = (props: RenderElementProps) => {
  return <p {...props.attributes}>{props.children}</p>
}

const Leaf = (props: RenderLeafProps) => {
  return (
    <span
      {...props.attributes}
      style={{ fontWeight: props.leaf.bold ? 'bold' : 'normal' }}
    >
      {props.children}
    </span>
  )
}

export default App
