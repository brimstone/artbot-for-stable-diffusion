import dynamic from 'next/dynamic'
import { EditorProps } from 'types/props'

const DynamicEditor = dynamic(() => import('./editor'), {
  ssr: false
})

export default function Editor(props: EditorProps) {
  return <DynamicEditor {...props} />
}
