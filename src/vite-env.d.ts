/**
 * REQUIRED: Enables TypeScript support for Vite features
 *
 * This reference directive provides type definitions for:
 * - CSS/SCSS imports: import "./styles.scss"
 * - Asset imports: import logo from "./logo.png"
 * - Environment variables: import.meta.env.VITE_*
 * - Hot Module Replacement: import.meta.hot
 *
 * Without this, TypeScript will show "Cannot find module" errors
 * for stylesheet and asset imports.
 */
/// <reference types="vite/client" />
