describe("Math functions with 2 positive integers", function() {
    let num1;
    let num2;
    beforeEach(function() {
        // arrange
        num1 = 195;
        num2 = 3;
    });

    it("should add two positive numbers", () => {
        //       expect(infoE).toBeDefined();
        //       expect(infoE.id).toBe('info-E-id')
        //   });
        //   it('add two numbers', function() {

        // act
        const result = add(num1, num2);
        // assert
        expect(result).toBe(198);
    });
    it("multiply two positive numbers", function() {
        // act
        const result = multiply(num1, num2);

        // assert
        expect(result).toBe(585);
    });
    it("substract two positive numbers", function() {
        // act
        const result = substract(num1, num2);

        // assert
        expect(result).toBe(192);
    });
    it("divide two positive numbers", function() {
        // act
        const result = divide(num1, num2);

        // assert
        expect(result).toBe(65);
    });
});
describe("Check [+] add function with different values", function() {
    let varsToCheck;
    varsToCheck = [
        //[num1, num2, result, error]
        [1, 2, 3, ''],
        [30.01, 30.02, 60.03, ''],
        [1000.021, 0.02, 1000.041, ''],
        [0.1, 0.2, 0.3, ''],
        [0.7, 0.1, 0.8, ''],
        [0.01, 0.02, 0.03, ''],
        [0.008, 0.002, 0.01, ''],
        [0.0008, 0.0002, 0.001, ''],
        [0.01, 0.06, 0.07, ''],
        [1, -2, -1, ''],
        [1.2, 2.3, 3.5, ''],
        [-4, -9, -13, ''],

    ];

    for (let i = 0; i < varsToCheck.length; i++) {
        it(`Should add properly: (${varsToCheck[i][0]}) + (${varsToCheck[i][1]}) = ${varsToCheck[i][2]}`, function() {
            //arrange
            let result;

            if (error || memoryError) {
                clear();
            }
            result = add(varsToCheck[i][0], varsToCheck[i][1]);
            expect(result).toBe(varsToCheck[i][2]);
            expect(error).toBe(varsToCheck[i][3]);
        });
    }
});
describe("Check [-] substract function with different values", function() {
    let varsToCheck;
    varsToCheck = [
        //[num1, num2, result, error]
        [9, 2, 7, ''],
        [194.1193, 159, 35.1193, ''],
        [42.5, 42.65, -0.15, ''],
        [0.3, 0.2, 0.1, ''],
        [0.1, 0.3, -0.2, ''],
        [53, -1000, 1053, ''],
        [2, 7, -5, ''],
        [-10, -6, -4, ''],
    ];

    for (let i = 0; i < varsToCheck.length; i++) {
        it(`Should substract properly: (${varsToCheck[i][0]}) - (${varsToCheck[i][1]}) = ${varsToCheck[i][2]}`, function() {
            //arrange
            let result;

            if (error || memoryError) {
                clear();
            }
            result = substract(varsToCheck[i][0], varsToCheck[i][1]);
            expect(result).toBe(varsToCheck[i][2]);
            expect(error).toBe(varsToCheck[i][3]);
        });
    }
});

describe("Check [*] multiply function with different values", function() {
    let varsToCheck;
    varsToCheck = [
        //[num1, num2, result, error]
        [9, 2, 18, ''],
        [0.6666666, 2, 1.3333332, ''],
        [6666, 3, 19998, ''],
        [0.6666666, 3, 1.9999998, ''],
        [0.1, 2232.00, 223.2, ''],
        [1, 32.09, 32.09, ''],
        [200.30, 3, 600.9, ''],
        [2232.00, 0.1, 223.2, ''],
        [0.003, 1000, 3, ''],
        [100, 25, 2500, ''],
        [9.99, 5, 49.95, ''],
        [0.1, 0.2, 0.02, ''],
        [0.3, 0.0003, 0.00009, ''],
        [95, 722228.63, 68611719, ''],
        [0.6, 3, 1.8, ''],
        [2, -7, -14, ''],
        [-10, -6, 60, ''],
        [99999999, 99999999, 99999998, 'Number is too long for display.'],
        [99999999, 0.1, 9999999.9, ''],
    ];

    for (let i = 0; i < varsToCheck.length; i++) {
        it(`Should multiply properly: (${varsToCheck[i][0]}) * (${varsToCheck[i][1]}) = ${varsToCheck[i][2]}`, function() {
            //arrange
            let result;

            if (error || memoryError) {
                clear();
            }
            result = multiply(varsToCheck[i][0], varsToCheck[i][1]);
            expect(result).toBe(varsToCheck[i][2]);
            expect(error).toBe(varsToCheck[i][3]);
        });
    }
});

describe("Check [/] divide function with different values", function() {
    let varsToCheck;
    varsToCheck = [
        //[num1, num2, result, error]
        [9, 3, 3, ''],
        [2, 3, 0.6666666, ''],
        [0.6666666, 2, 0.3333333, ''],
        [1, 32.09, 0.0311623, ''],
        [223.2, 2232.00, 0.1, ''],
        [10, 100, 0.1, ''],
        [2232.00, 0.1, 22320, ''],
        [1, 5000, 0.0002, ''],
        [2, 1000, 0.002, ''],
        [100, 50, 2, ''],
        [0.9, 0.03, 30, ''],
        [12, -4, -3, ''],
        [-60, -6, 10, ''],
        [-10, 0, "Undefined", "Division by 0 is impossible."],
        [10, 0, "Undefined", "Division by 0 is impossible."],
    ];

    for (let i = 0; i < varsToCheck.length; i++) {
        it(`Should divide properly: (${varsToCheck[i][0]}) / (${varsToCheck[i][1]}) = ${varsToCheck[i][2]}; ${varsToCheck[i][3] ? 'ERROR:' + varsToCheck[i][3] :'' }`, function() {
            //arrange
            let result;
            if (error || memoryError) {
                clear();
            }
            result = divide(varsToCheck[i][0], varsToCheck[i][1]);
            expect(result).toBe(varsToCheck[i][2]);
            expect(error).toBe(varsToCheck[i][3]);
            // }
        });
    }

});