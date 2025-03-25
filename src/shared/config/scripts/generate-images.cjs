const fs = require('fs')
const path = require('path')

/**
 * Generates React components for each PNG file in the specified directory.
 * Usage: `node generate-images.cjs`
 */

// 1. PNG 파일이 들어있는 폴더 경로 설정
const imagesDir = path.join(__dirname, '../../assets/images')

// 2. 최종적으로 생성할 index.tsx 파일 경로
const indexFilePath = path.join(imagesDir, 'index.tsx')

/**
 * 문자열을 PascalCase로 변환해주는 함수
 * 예) "img_bookmark" -> "ImgBookmark"
 */
function toPascalCase(str) {
  return str
    .split(/[-_]/)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1).toLowerCase())
    .join('')
}

/**
 * 문자열을 camelCase로 변환해주는 함수
 * 예) "img_bookmark" -> "imgBookmark"
 */
function toCamelCase(str) {
  const pascal = toPascalCase(str)
  return pascal.charAt(0).toLowerCase() + pascal.slice(1)
}

/**
 * PNG 파일들을 스캔하여, 각 파일을 import 후 React 컴포넌트 형태로 export하는
 * index.tsx 파일을 생성해주는 메인 함수
 */
function generateImageComponents() {
  // (1) images 폴더가 존재하는지 확인
  if (!fs.existsSync(imagesDir)) {
    console.error(`Directory not found: ${imagesDir}`)
    process.exit(1)
  }

  // (2) images 폴더 내 .png 파일만 필터링
  const pngFiles = fs.readdirSync(imagesDir).filter((file) => {
    const filePath = path.join(imagesDir, file)
    return fs.lstatSync(filePath).isFile() && path.extname(file).toLowerCase() === '.png'
  })

  // (3) 만약 .png 파일이 하나도 없다면 경고 후 종료
  if (pngFiles.length === 0) {
    console.warn(`No PNG files found in directory: ${imagesDir}`)
    process.exit(0)
  }

  // (4) index.tsx 내용의 시작 부분
  let content = `// This file is auto-generated by generate-images.cjs.
// Do not edit manually.\n\n`

  // (5) 각 PNG 파일에 대한 import 구문 생성
  pngFiles.forEach((file) => {
    const baseName = path.basename(file, '.png')
    const camelName = toCamelCase(baseName)
    content += `import ${camelName} from "./${file}"\n`
  })

  // content += '\n'
  content += '\n// Type definition for image component props\n'
  content += 'type ImageComponentProps = React.ImgHTMLAttributes<HTMLImageElement>;\n\n'

  // (6) 각 PNG 파일에 대한 React 컴포넌트 export 구문 생성
  pngFiles.forEach((file) => {
    const baseName = path.basename(file, '.png')
    const pascalName = toPascalCase(baseName)
    const camelName = toCamelCase(baseName)
    // alt 텍스트는 "img_" 접두어 제거 (필요에 따라 가공)
    const altText = baseName.replace(/^img_/, '')
    content += `export const ${pascalName}: React.FC<ImageComponentProps> = ({ ...props }) => {\n  return <img src={${camelName}} alt="${altText}" {...props} />;\n};\n\n`
  })

  // (7) 최종적으로 생성된 content를 index.tsx 파일로 저장
  fs.writeFileSync(indexFilePath, content, 'utf8')

  console.log(`Successfully generated ${indexFilePath} with ${pngFiles.length} components.`)
}

// (8) 스크립트 실행
generateImageComponents()
