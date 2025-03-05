"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const connection_1 = __importDefault(require("../db/connection"));
const viewDepartments = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield connection_1.default.query('SELECT * FROM department'); // Use pool instead of client
        if (res.rows.length > 0) {
            console.table(res.rows);
        }
        else {
            console.log('No departments found.');
        }
    }
    catch (err) {
        console.error('Error viewing departments:', err);
    }
});
exports.default = viewDepartments;
