import {
  diffLines,
} from 'diff'

export function generateTextDiff(
  oldText: string,
  newText: string
) {
  return diffLines(
    oldText,
    newText
  )
}