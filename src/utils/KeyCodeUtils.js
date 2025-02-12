class KeyCodeUtils {

    // Các mã phím tắt thường gặp
    static UP = 38;  // Mã phím mũi tên lên
    static DOWN = 40;  // Mã phím mũi tên xuống
    static TAB = 9;  // Mã phím Tab
    static ENTER = 13;  // Mã phím Enter
    static E = 69;  // Mã phím 'E'
    static ESCAPE = 27;  // Mã phím Escape

    // Phương thức kiểm tra xem mã phím có phải là phím điều hướng (mũi tên, tab, delete, backspace, enter) hay không
    static isNavigation(e) {
        // Kiểm tra mã phím nằm trong phạm vi từ 33 đến 40 (mũi tên lên, xuống, trái, phải, page up, page down)
        // Cũng kiểm tra mã phím Tab (9), Backspace (8), Delete (46), và Enter (13)
        return (e >= 33 && e <= 40) || e === 9 || e === 8 || e === 46 || e === 14 || e === 13;
    }

    // Phương thức kiểm tra xem mã phím có phải là phím số hay không
    static isNumeric(e) {
        // Kiểm tra mã phím trong phạm vi 48 đến 57 (0-9 trên bàn phím chính)
        // Kiểm tra mã phím trong phạm vi 96 đến 105 (0-9 trên bàn phím số)
        return (e >= 48 && e <= 57) || (e >= 96 && e <= 105);
    }

    // Phương thức kiểm tra xem mã phím có phải là chữ cái (A-Z) hay không
    static isAlphabetic(e) {
        // Kiểm tra mã phím từ 65 đến 90 (chữ cái hoa từ A đến Z)
        return (e >= 65 && e <= 90);
    }

    // Phương thức kiểm tra xem mã phím có phải là dấu thập phân (.) hay không
    static isDecimal(e) {
        // Kiểm tra mã phím là dấu chấm (190), dấu phẩy (188), hoặc dấu thập phân trên bàn phím số (108, 110)
        return e === 190 || e === 188 || e === 108 || e === 110;
    }

    // Phương thức kiểm tra xem mã phím có phải là dấu gạch ngang (-) hay không
    static isDash(e) {
        // Kiểm tra mã phím là dấu gạch ngang (109) hoặc dấu gạch ngang trên bàn phím số (189)
        return e === 109 || e === 189;
    }
}

export default KeyCodeUtils;
