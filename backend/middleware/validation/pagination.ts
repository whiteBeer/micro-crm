import { query } from "express-validator";

export const paginationValidators = [
    query("skip")
        .optional()
        .isInt({ min: 0 })
        .withMessage("skip_is_out_of_range")
        .toInt(),
    query("limit")
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage("limit_is_out_of_range")
        .toInt()
];