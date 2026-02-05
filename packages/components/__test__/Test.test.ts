import { render } from 'vitest-browser-vue';
import Test from '../src/Test/Test.vue';
import { expect, test, describe } from 'vitest';

describe('Test.vue', () => {
    test('输入变化时结果应异步更新', async () => {
        const screen = render(Test);
        const num1 = screen.getByTestId('num1');
        const num2 = screen.getByTestId('num2');
        const result = screen.getByTestId('num3');

        // ✅ toHaveValue：自动精确匹配（单值输入）
        await expect.element(num1).toHaveValue(1);
        await expect.element(num2).toHaveValue(2);

        // ✅ toHaveTextContent：必须 exact: true 避免子串误判
        await expect.element(result).toHaveTextContent('result:3', { exact: true });

        await num1.fill('3');
        await num2.fill('4');

        await expect.element(result).toHaveTextContent('result:7', { exact: true });
    });
});
