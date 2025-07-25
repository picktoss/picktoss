import mammoth from 'mammoth'
import { marked } from 'marked'
import * as pdfjs from 'pdfjs-dist'
import { TextItem, TextMarkedContent } from 'pdfjs-dist/types/src/display/api'

import { FILE_CONSTRAINTS } from '@/features/note/config'
import { isValidFileType } from '@/features/note/model/schema'

import '@/shared/lib/pdf'

// 1000자 당, 재화 2개 소모를 가정
export const STAR_PER_THOUSAND = 2

// 글자 수에 따른 소모 재화 계산
export const calculateStar = (charCount: number) => {
  const star = Math.floor((charCount / 1000) * STAR_PER_THOUSAND)
  return star
}

/** markdown string을 받아 markdown 문법을 제거해 텍스트만 반환하는 함수 */
export function extractPlainText(markdownText: string) {
  // 마크다운 -> HTML 변환
  const html = marked(markdownText, { gfm: true, async: false })

  // HTML -> 텍스트 추출
  const div = document.createElement('div')
  div.innerHTML = html
  return div.textContent || ''
}

/** 비동기 처리 - markdown string을 받아 markdown 문법을 제거해 텍스트만 반환하는 함수 */
export async function extractPlainTextAsync(markdownText: string) {
  // 마크다운 -> HTML 변환
  const html = await marked(markdownText, { gfm: true })

  // HTML -> 텍스트 추출
  const div = document.createElement('div')
  div.innerHTML = html
  return div.textContent || ''
}

export const formatFileSize = (size: number) => {
  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
  return `${(size / (1024 * 1024)).toFixed(1)} MB`
}

/** 입력받은 file(pdf, docx, txt)을 markdown으로 변환해 반환하는 함수 */
export const generateMarkdownFromFile = async (file: File): Promise<string> => {
  if (!file) {
    throw new Error('파일이 제공되지 않았습니다.')
  }

  if (!isValidFileType(file)) {
    throw new Error(`지원하지 않는 파일 형식입니다: ${file.type}`)
  }

  try {
    const fileExtension = `.${file.name.toLowerCase().split('.').pop()}`

    // MIME 타입이나 확장자를 기준으로 적절한 핸들러 선택
    if (
      file.type === FILE_CONSTRAINTS.SUPPORTED_TYPES.PDF.mime ||
      fileExtension === FILE_CONSTRAINTS.SUPPORTED_TYPES.PDF.extension
    ) {
      return await handlePdfFile(file)
    }

    if (
      file.type === FILE_CONSTRAINTS.SUPPORTED_TYPES.DOCX.mime ||
      fileExtension === FILE_CONSTRAINTS.SUPPORTED_TYPES.DOCX.extension
    ) {
      return await handleDocxFile(file)
    }

    if (
      file.type === FILE_CONSTRAINTS.SUPPORTED_TYPES.TXT.mime ||
      fileExtension === FILE_CONSTRAINTS.SUPPORTED_TYPES.TXT.extension
    ) {
      return await handleTxtFile(file)
    }

    throw new Error('지원하지 않는 파일 형식입니다.')
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`파일 변환 오류: ${error.message}`)
    }
    throw new Error('파일 변환 중 알 수 없는 오류가 발생했습니다.')
  }
}

// 기호 정의
const SYMBOLS = new Set([
  '◇',
  '◆',
  '◈',
  '►',
  '▸',
  '▹',
  '▻',
  '➔',
  '➜',
  '➤',
  '➢',
  '⇒',
  '⇨',
  '⟹',
  '→',
  '⦿',
  '⦾',
  '⊙',
  '-',
  '•',
  '＊',
  '※',
  '○',
  '●',
  '■',
  '□',
  '▪︎',
  '⚫️',
  '★',
  '☆',
  '✔',
  '☑',
  '⬜',
  '⬛',
  '▶',
  '=>',
])

const isTextItem = (item: TextItem | TextMarkedContent): item is TextItem => {
  if ('str' in item && 'transform' in item) {
    return item && typeof item.str === 'string' && (item.width ?? 0) > 2 && Array.isArray(item.transform)
  }

  return 'str' in item && 'transform' in item
}

const extractFontSize = (item: TextItem): number => {
  return Math.abs(item.transform[0]) || Math.abs(item.transform[3]) || 10
}

interface CustomTextItem {
  x: number
  y: number
  text: string
  fontSize: number
  width: number
  height: number
  isBold?: boolean
}

// pdf 핸들러 (텍스트 분리 현상 개선 + 띄어쓰기 처리 + 제목 처리 + 세로 중앙 구분선 처리)
const handlePdfFile = async (file: File): Promise<string> => {
  const fileBuffer = await file.arrayBuffer()

  const loadingTask = pdfjs.getDocument({
    data: fileBuffer,
    cMapUrl: `${window.location.origin}cmaps/`,
    cMapPacked: true,
  })

  const pdf = await loadingTask.promise
  let markdown = ''
  const fontSizes: number[] = []

  // 폰트 크기 수집 (제목 임계값 계산)
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum)
    const textContent = await page.getTextContent()

    textContent.items.filter(isTextItem).forEach((item) => {
      fontSizes.push(extractFontSize(item))
    })
  }

  const averageFontSize = fontSizes.reduce((sum, size) => sum + size, 0) / fontSizes.length
  const h1Threshold = averageFontSize * 1.6
  const h2Threshold = averageFontSize * 1.3
  const h3Threshold = averageFontSize * 1.1
  const boldText = averageFontSize * 1.03

  /** 중앙 세로 구분선이 있는 노트 필기를 위한 함수 */
  const detectVerticalDivider = (items: CustomTextItem[]): number | null => {
    const xPositions = items.map((item) => item.x)
    const minX = Math.min(...xPositions)
    const maxX = Math.max(...xPositions)
    const width = maxX - minX
    const centerRegionStart = minX + width * 0.4
    const centerRegionEnd = minX + width * 0.6

    // 동적 bucketSize 설정 (문서 크기에 맞게 자동 조정)
    const bucketSize = Math.max(5, width * 0.01) // 최소 5px, 최대 너비의 1% 이하
    const histogram: { [key: number]: number } = {}

    xPositions.forEach((x) => {
      const bucket = Math.floor(x / bucketSize) * bucketSize
      histogram[bucket] = (histogram[bucket] || 0) + 1
    })

    // 중앙 부분(40% ~ 60% 영역)에서 가장 작은 빈도를 찾음
    let separatorX: number | null = null
    let minCount = Infinity

    Object.entries(histogram).forEach(([bucket, count]) => {
      const bucketX = parseFloat(bucket)
      if (bucketX >= centerRegionStart && bucketX <= centerRegionEnd && count < minCount) {
        minCount = count
        separatorX = bucketX
      }
    })

    // 임계값 이하인지 확인 (전체 평균의 30% 이하이면 유효한 중앙선)
    const avgCount = Object.values(histogram).reduce((sum, c) => sum + c, 0) / Object.keys(histogram).length
    if (separatorX !== null && minCount < avgCount * 0.3) {
      return separatorX
    }
    return null
  }

  /** 텍스트 정렬, 제목 처리 후 마크다운으로 반환하는 함수 */
  const processTextBlock = (items: CustomTextItem[]) => {
    // Y 좌표 그룹화 (동적으로 y좌표 기준 정의)
    const yGroups: { [key: number]: number } = {}
    items.forEach((item) => {
      let foundGroup = false
      const isHeading = item.fontSize >= h1Threshold || item.fontSize >= h2Threshold || item.fontSize >= h3Threshold
      const threshold = isHeading ? item.height * 1.2 : item.height * 0.8

      Object.keys(yGroups).forEach((groupYStr) => {
        const groupY = parseFloat(groupYStr)
        if (Math.abs(item.y - groupY) < threshold) {
          foundGroup = true
          yGroups[groupY]++
          item.y = groupY
        }
      })
      if (!foundGroup) {
        yGroups[item.y] = 1
      }
    })

    // 정렬
    items.sort((a, b) => {
      const yDiff = b.y - a.y
      const isHeading = a.fontSize >= h1Threshold || a.fontSize >= h2Threshold || a.fontSize >= h3Threshold
      const threshold = isHeading ? Math.min(a.height, b.height) * 1.2 : Math.min(a.height, b.height) * 0.8

      if (Math.abs(yDiff) < threshold) {
        return a.x - b.x
      }
      return yDiff
    })

    // 텍스트 수집을 위한 라인 배열
    interface LineInfo {
      text: string
      fontSize: number
      y: number
    }
    const lines: LineInfo[] = []
    let currentLine = ''
    let currentFontSize = 0
    let currentY = 0
    let previousY: number | null = null
    let previousX: number | null = null

    // 텍스트 수집
    items.forEach(({ x, y, text, fontSize, width }) => {
      const isSymbol = SYMBOLS.has(text.trim())

      // 새로운 줄 판단
      const isNewLine = previousY !== null && Math.abs(previousY - y) > fontSize * 1.5

      if (isNewLine && currentLine) {
        lines.push({
          text: currentLine.trim(),
          fontSize: currentFontSize,
          y: currentY,
        })
        currentLine = ''
      }

      if (!currentLine) {
        currentFontSize = fontSize
        currentY = y
      }

      // 텍스트 추가
      if (!isSymbol) {
        if (previousX !== null) {
          const gap = x - previousX
          if (gap > fontSize * 0.5) {
            currentLine += ' '
          }
        }
        currentLine += text
      } else {
        if (x < (previousX || Infinity)) {
          if (currentLine) {
            lines.push({
              text: currentLine.trim(),
              fontSize: currentFontSize,
              y: currentY,
            })
            currentLine = ''
          }
          currentLine = ' \n\n ' + text + ' '
        } else {
          currentLine += ' \n\n ' + text + ' '
        }
      }

      previousY = y
      previousX = x + width
    })

    // 마지막 라인 처리
    if (currentLine) {
      lines.push({
        text: currentLine.trim(),
        fontSize: currentFontSize,
        y: currentY,
      })
    }

    // 제목 처리 및 마크다운 생성
    let resultMarkdown = ''
    let i = 0
    while (i < lines.length) {
      const line = lines[i] as LineInfo
      const nextLine = i + 1 < lines.length ? lines[i + 1] : null

      // 제목 여부 확인 및 다음 줄과의 병합 여부 결정
      if (line.fontSize >= h1Threshold) {
        const shouldMerge = nextLine && Math.abs(line.y - nextLine.y) < line.fontSize * 1.2
        if (shouldMerge) {
          resultMarkdown += `# ${line.text} ${nextLine.text}\n\n`
          i += 2
        } else {
          resultMarkdown += `# ${line.text}\n\n`
          i++
        }
      } else if (line.fontSize >= h2Threshold) {
        const shouldMerge = nextLine && Math.abs(line.y - nextLine.y) < line.fontSize * 1.2
        if (shouldMerge) {
          resultMarkdown += `## ${line.text} ${nextLine.text}\n\n`
          i += 2
        } else {
          resultMarkdown += `## ${line.text}\n\n`
          i++
        }
      } else if (line.fontSize >= h3Threshold) {
        const shouldMerge = nextLine && Math.abs(line.y - nextLine.y) < line.fontSize * 1.2
        if (shouldMerge) {
          resultMarkdown += `### ${line.text} ${nextLine.text}\n\n`
          i += 2
        } else {
          resultMarkdown += `### ${line.text}\n\n`
          i++
        }
      } else {
        if (line.fontSize >= boldText) {
          resultMarkdown += `**${line.text}**\n\n`
        } else {
          resultMarkdown += `${line.text}\n\n`
        }
        i++
      }
    }

    return resultMarkdown
  }

  // 페이지 별 텍스트 처리
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    try {
      const page = await pdf.getPage(pageNum)
      const textContent = await page.getTextContent()

      const textItems = textContent.items.filter(isTextItem).map((item) => {
        const transform: number[] = item.transform as number[]
        return {
          x: transform[4] ?? 0,
          y: transform[5] ?? 0,
          text: item.str,
          fontSize: extractFontSize(item),
          width: item.width ?? 0,
          height: item.height ?? 0,
        }
      })

      const separatorX = detectVerticalDivider(textItems)

      let resultMarkdown = ''

      if (separatorX !== null) {
        const leftItems = textItems.filter((item) => item.x < separatorX - 10)
        const rightItems = textItems.filter((item) => item.x > separatorX + 10)

        const leftMarkdown = processTextBlock(leftItems)
        const rightMarkdown = processTextBlock(rightItems)

        resultMarkdown = `${leftMarkdown}\n\n${rightMarkdown}\n\n`
      } else {
        const markdown = processTextBlock(textItems)

        resultMarkdown = markdown
      }

      markdown += resultMarkdown
    } catch (error) {
      console.error(`PDF 페이지 ${pageNum} 처리 중 오류:`, error)
      throw new Error(`PDF 페이지 ${pageNum} 처리 중 오류가 발생했습니다.`)
    }
  }

  return markdown.trim()
}

// docx 핸들러
const handleDocxFile = async (file: File): Promise<string> => {
  try {
    const arrayBuffer = await file.arrayBuffer()
    const result = await mammoth.extractRawText({ arrayBuffer })
    return result.value.trim()
  } catch (error) {
    console.log(error)
    throw new Error('DOCX 파일 처리 중 오류가 발생했습니다.')
  }
}

// txt 핸들러
const handleTxtFile = async (file: File): Promise<string> => {
  try {
    const text = await file.text()
    return text.trim()
  } catch (error) {
    console.log(error)
    throw new Error('TXT 파일 처리 중 오류가 발생했습니다.')
  }
}
