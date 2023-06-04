/**
 * 추가 제약 가능한 plugin
 * - eslint-plugin-import
 * - eslint-plugin-no-null
 * - eslint-plugin-jsdoc
 * - eslint-plugin-prefer-arrow
 */
module.exports = {
    root: true,
    /**
     * 기본적으로 지원하는 환경
     * - 해당 환경의 문법, API, 전역 변수 허용
     * https://eslint.org/docs/latest/user-guide/configuring/language-options#specifying-environments
     */
    env: {
        browser: true,
        es6: true,
        node: true,
        'jest/globals': true,
    },
    /**
     * TypeScript 지원
     */
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: './tsconfig.json',
        /**
         * project에 설정된 대상 외의 파일도 분석 대상으로 지정
         * @example .storybook 경로의 파일들
         */
        createDefaultProgram: true,
    },
    /**
     * 기본 설정 외 지정한 설정 포함
     * https://eslint.org/docs/latest/user-guide/configuring/configuration-files#extending-configuration-files
     */
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        // TODO 김명호: 1차 이후 적용 예정
        // "plugin:import/recommended",
        // "plugin:import/typescript",
        'plugin:jest/recommended',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
        /**
         * React 17 사용 시 적용 필요
         * https://github.com/jsx-eslint/eslint-plugin-react#configuration
         */
        'plugin:react/jsx-runtime',
    ],
    plugins: ['miricanvas', '@typescript-eslint', '@typescript-eslint/tslint', 'import', 'react', 'react-hooks', 'jest'],
    /**
     * 전역 변수 허용
     * https://eslint.org/docs/latest/user-guide/configuring/language-options#using-configuration-files-1
     */
    globals: {
        // jQuery
        $: 'readonly',
        // webpack 빌드 시 생성되는 해시
        __webpack_hash__: 'readonly',
    },
    /**
     * 모든 규칙에 동일하게 적용할 정보 설정
     * https://eslint.org/docs/latest/user-guide/configuring/configuration-files#adding-shared-settings
     */
    settings: {
        /**
         * 'extends > plugin:react/jsx-runtime'와 함께 설정
         * https://github.com/jsx-eslint/eslint-plugin-react#configuration
         */
        react: {
            version: 'detect',
        },
        // https://github.com/jest-community/eslint-plugin-jest#jest-version-setting
        jest: {
            version: require('jest/package.json').version,
        },
    },
    ignorePatterns: ['*.css'],
    /**
     * '@typescript-eslint'와 'eslint' 겹치는 설정이 있으면 @typescript-eslint 사용
     * - @typescript-eslint 내부에서 eslint를 다루고 있으니 eslint 고유 설정만 eslint로 설정
     * - 중복 설정하면 잘못 동작할 수 있음
     * ESLint 모든 규칙
     * - https://eslint.org/docs/latest/rules/
     * TypeScript ESLint 모든 규칙
     * - https://typescript-eslint.io/rules/
     */
    rules: {
        /**
         * Array.prototype.forEach/filter/... 와 같은 함수에서 콜백 함수를 비동기(async)로 선언하지 못하게 함
         * @example
         * bad
         * [1, 2, 3].forEach(async num => ...)
         *
         * good
         * for (const num of numbers) {
         *     await doSomething
         * }
         *
         * await PromiseAll.([1, 2, 3].map(async num => ...))
         */
        'miricanvas/no-async-in-array-method': 'error',
        /**
         * 브라우저 새탭 실행 시, HTTP 요청 헤더에 referer 정보를 포함시키지 않게 함
         * TODO: SEO 관점에서 참조 정보가 필요할 수 있어서 MA 스쿼드 확인하기 전까지 off
         * @example
         * bad
         * <a href={'http://www.xxx.com'} target={'_blank'}>
         *
         * good
         * <a href={'http://www.xxx.com'} target={'_blank'} rel="noreferrer">
         */
        'react/jsx-no-target-blank': 'off',

        /**
         * 금지 타입
         * https://typescript-eslint.io/rules/ban-types
         */
        '@typescript-eslint/ban-types': [
            'error',
            {
                types: {
                    Object: {
                        message: 'Avoid using the `Object` type. Did you mean `object`?',
                    },
                    Function: {
                        message: 'Avoid using the `Function` type. Prefer a specific function type, like `() => void`.',
                    },
                    Boolean: {
                        message: 'Avoid using the `Boolean` type. Did you mean `boolean`?',
                    },
                    Number: {
                        message: 'Avoid using the `Number` type. Did you mean `number`?',
                    },
                    String: {
                        message: 'A Avoid using the `String` type. Did you mean `string`?',
                    },
                    Symbol: {
                        message: 'Avoid using the `Symbol` type. Did you mean `symbol`?',
                    },
                },
            },
        ],
        /**
         * namespace 허용
         * - enum과 namespace 이름 동일하게 하여 사용하는 경우가 있음
         * @see DesignResourceType
         * https://typescript-eslint.io/rules/no-namespace
         */
        '@typescript-eslint/no-namespace': 'off',
        /**
         * 함수의 반환 타입 명시 off
         * - 콜백으로 넘기는 경우도 번거롭게 선언해야 하므로 사용하지 않음
         * https://typescript-eslint.io/rules/explicit-function-return-type
         */
        '@typescript-eslint/explicit-function-return-type': 'off',
        /**
         * 기본적으로 엄격 비교(===, !==)만 허용
         * - 예외적으로 일반 비교(==, !=)는 '문자열 or typeof or null' 허용
         * @example 예외 허용
         * typeof foo == "undefined"
         * "hello" != "world"
         * 0 == 0
         * true == true
         * foo == null
         * https://eslint.org/docs/latest/rules/eqeqeq
         */
        eqeqeq: ['error', 'smart'],
        /**
         * 변수, 함수, 객체 속성, 클래스 이름 짓기 금지어 리스트
         * https://eslint.org/docs/latest/rules/id-denylist
         */
        'id-denylist': ['error', 'any', 'Number', 'number', 'String', 'string', 'Boolean', 'boolean', 'Undefined', 'undefined'],
        /**
         * 디버깅 할 때 강제 break 하는 debugger 사용 금지
         * https://eslint.org/docs/latest/rules/no-debugger
         */
        'no-debugger': 'error',
        /**
         * eval() 사용 금지
         * https://eslint.org/docs/latest/rules/no-eval
         */
        'no-eval': 'error',
        /**
         * var 사용 금지
         * - let or const 사용
         * https://eslint.org/docs/latest/rules/no-var
         */
        'no-var': 'error',
        /**
         * NaN 비교 시 isNaN or Number.isNaN 사용
         * https://eslint.org/docs/latest/rules/use-isnan
         */
        'use-isnan': 'error',

        /**
         * ************************************************************
         *
         *
         *
         *
         *
         * 레이아웃 & 포맷팅
         *
         *
         *
         *
         *
         * ************************************************************
         */

        /**
         * 연속적으로 '2줄 이상' 빈 라인 금지
         * @example
         * var foo = 5;
         *
         *
         * var bar = 3;
         * https://eslint.org/docs/latest/rules/no-multiple-empty-lines
         */
        'no-multiple-empty-lines': [
            'error',
            {
                max: 1,
            },
        ],
        /**
         * class 내의 멤버와 메서드 간에 여백
         * - 변수 필드 간에도 줄바꿈이 적용되어서 off
         * @example
         * bad
         * class MyClass {
         *   x;
         *   foo() {
         *     //...
         *   }
         *   bar() {
         *     //...
         *   }
         * }
         *
         * good
         * class MyClass {
         *   x;
         *
         *   foo() {
         *     //...
         *   }
         *
         *   bar() {
         *     //...
         *   }
         * }
         *
         * https://eslint.org/docs/latest/rules/lines-between-class-members
         */
        'lines-between-class-members': 'off',
        /**
         * 블럭 줄바꿈 스타일
         * @example
         * if (foo) {
         *   bar();
         * } else {
         *   baz();
         * }
         *
         * https://eslint.org/docs/latest/rules/brace-style
         */
        'brace-style': [
            'error',
            // 1tbs(One True Brace Style)
            '1tbs',
        ],
        /**
         * 최소 블럭 1개
         * @example
         * bad
         * if (foo) foo++;
         *
         * while (bar)
         *     baz();
         *
         * if (foo) {
         *     baz();
         * } else qux();
         *
         * good
         * if (foo) {
         *     foo++;
         * }
         *
         * while (bar) {
         *     baz();
         * }
         *
         * if (foo) {
         *     baz();
         * } else {
         *     qux();
         * }
         *
         * https://eslint.org/docs/latest/rules/curly
         */
        curly: 'error',
        /**
         * "packages" 로 시작하는 import 금지, 합성기에서 packages 경로를 인식할 수 없어서 에러 발생함.
         */
        'import/no-internal-modules': [
            'error',
            {
                forbid: ['packages/**'],
            },
        ],
    },
    /**
     * 특정 대상에게 예외 적용
     */
    overrides: [
        /**
         * 테스트코드 전용 예외
         */
        {
            files: ['**/*test.ts', '**/*test.tsx'],
            rules: {
                /** expect 사용 시, any 타입으로 해석되므로 허용 */
                '@typescript-eslint/no-unsafe-member-access': 'off',
                '@typescript-eslint/no-unsafe-call': 'off',
                // 기본 타입으로 테스트하기 위해 허용
                'no-magic-numbers': 'off',
            },
        },
        /**
         * 노드 서버 등 JS코드 예외
         */
        {
            files: ['**/*.js'],
            rules: {
                '@typescript-eslint/no-unsafe-member-access': 'off',
                '@typescript-eslint/no-unsafe-call': 'off',
                '@typescript-eslint/no-var-requires': 'off',
                '@typescript-eslint/no-unsafe-assignment': 'off',
                '@typescript-eslint/no-unsafe-argument': 'off',
                '@typescript-eslint/no-unsafe-return': 'off',
                '@typescript-eslint/no-unsafe-assignment': 'off',
                '@typescript-eslint/restrict-template-expressions': 'off',
            },
        },
    ],
};
