import { useCallback, useState } from 'react'
import { createEditor, Descendant, Transforms, Element, Editor } from 'slate'

import {
  Slate,
  Editable,
  withReact,
  ReactEditor,
  RenderElementProps,
} from 'slate-react'

const initialValue: Descendant[] = [
  {
    type: 'paragraph',
    children: [{ text: 'A line of text in a paragraph.' }],
  },
]
const App = () => {
  const [editor] = useState<ReactEditor>(() => withReact(createEditor()))
  const renderElement = useCallback((props: RenderElementProps) => {
    switch (props.element.type) {
      case 'code':
        return <CodeElement {...props} />
      default:
        return <DefaultElement {...props} />
    }
  }, [])

  return (
    <Slate editor={editor} initialValue={initialValue}>
      <Editable
        renderElement={renderElement}
        onKeyDown={(event) => {
          if (event.key === '`' && event.ctrlKey) {
            event.preventDefault()
            const [match] = Editor.nodes(editor, {
              match: (n) => n.type === 'code',
            })
            Transforms.setNodes(
              editor,
              { type: match ? 'paragraph' : 'code' },
              {
                match: (n) => Element.isElement(n) && Editor.isBlock(editor, n),
              }
            )
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

export default App
