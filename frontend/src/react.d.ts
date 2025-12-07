declare namespace React {
	type FC<P = {}> = (props: P) => JSX.Element | null;
	type ReactNode = any;
}

declare namespace JSX {
	interface IntrinsicElements {
		[elemName: string]: any;
	}
	interface Element {}
}
