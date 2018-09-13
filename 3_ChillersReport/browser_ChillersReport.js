/* global JsUtils */

function defineFuncForTabSpacing () {

	////////// Hard Coded Defs //////////
	const upArrow = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE2LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPg0KPCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCINCgkgd2lkdGg9IjI4NC45MjlweCIgaGVpZ2h0PSIyODQuOTI5cHgiIHZpZXdCb3g9IjAgMCAyODQuOTI5IDI4NC45MjkiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDI4NC45MjkgMjg0LjkyOTsiDQoJIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPGc+DQoJPHBhdGggZD0iTTI4Mi4wODIsMTk1LjI4NUwxNDkuMDI4LDYyLjI0Yy0xLjkwMS0xLjkwMy00LjA4OC0yLjg1Ni02LjU2Mi0yLjg1NnMtNC42NjUsMC45NTMtNi41NjcsMi44NTZMMi44NTYsMTk1LjI4NQ0KCQlDMC45NSwxOTcuMTkxLDAsMTk5LjM3OCwwLDIwMS44NTNjMCwyLjQ3NCwwLjk1Myw0LjY2NCwyLjg1Niw2LjU2NmwxNC4yNzIsMTQuMjcxYzEuOTAzLDEuOTAzLDQuMDkzLDIuODU0LDYuNTY3LDIuODU0DQoJCWMyLjQ3NCwwLDQuNjY0LTAuOTUxLDYuNTY3LTIuODU0bDExMi4yMDQtMTEyLjIwMmwxMTIuMjA4LDExMi4yMDljMS45MDIsMS45MDMsNC4wOTMsMi44NDgsNi41NjMsMi44NDgNCgkJYzIuNDc4LDAsNC42NjgtMC45NTEsNi41Ny0yLjg0OGwxNC4yNzQtMTQuMjc3YzEuOTAyLTEuOTAyLDIuODQ3LTQuMDkzLDIuODQ3LTYuNTY2DQoJCUMyODQuOTI5LDE5OS4zNzgsMjgzLjk4NCwxOTcuMTg4LDI4Mi4wODIsMTk1LjI4NXoiLz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjwvc3ZnPg0K'
	const downArrow = 'data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgdmlld0JveD0iMCAwIDEyOSAxMjkiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCAxMjkgMTI5Ij4KICA8Zz4KICAgIDxwYXRoIGQ9Im0xMjEuMywzNC42Yy0xLjYtMS42LTQuMi0xLjYtNS44LDBsLTUxLDUxLjEtNTEuMS01MS4xYy0xLjYtMS42LTQuMi0xLjYtNS44LDAtMS42LDEuNi0xLjYsNC4yIDAsNS44bDUzLjksNTMuOWMwLjgsMC44IDEuOCwxLjIgMi45LDEuMiAxLDAgMi4xLTAuNCAyLjktMS4ybDUzLjktNTMuOWMxLjctMS42IDEuNy00LjIgMC4xLTUuOHoiLz4KICA8L2c+Cjwvc3ZnPgo='
	const bothArrows =  'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE2LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPg0KPCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCINCgkgd2lkdGg9IjUxMS42MjZweCIgaGVpZ2h0PSI1MTEuNjI3cHgiIHZpZXdCb3g9IjAgMCA1MTEuNjI2IDUxMS42MjciIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUxMS42MjYgNTExLjYyNzsiDQoJIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPGc+DQoJPHBhdGggZD0iTTMyOC45MDYsNDAxLjk5NGgtMzYuNTUzVjEwOS42MzZoMzYuNTUzYzQuOTQ4LDAsOS4yMzYtMS44MDksMTIuODQ3LTUuNDI2YzMuNjEzLTMuNjE1LDUuNDIxLTcuODk4LDUuNDIxLTEyLjg0NQ0KCQljMC00Ljk0OS0xLjgwMS05LjIzMS01LjQyOC0xMi44NTFsLTczLjA4Ny03My4wOUMyNjUuMDQ0LDEuODA5LDI2MC43NiwwLDI1NS44MTMsMGMtNC45NDgsMC05LjIyOSwxLjgwOS0xMi44NDcsNS40MjQNCgkJbC03My4wODgsNzMuMDljLTMuNjE4LDMuNjE5LTUuNDI0LDcuOTAyLTUuNDI0LDEyLjg1MWMwLDQuOTQ2LDEuODA3LDkuMjI5LDUuNDI0LDEyLjg0NWMzLjYxOSwzLjYxNyw3LjkwMSw1LjQyNiwxMi44NSw1LjQyNg0KCQloMzYuNTQ1djI5Mi4zNThoLTM2LjU0MmMtNC45NTIsMC05LjIzNSwxLjgwOC0xMi44NSw1LjQyMWMtMy42MTcsMy42MjEtNS40MjQsNy45MDUtNS40MjQsMTIuODU0DQoJCWMwLDQuOTQ1LDEuODA3LDkuMjI3LDUuNDI0LDEyLjg0N2w3My4wODksNzMuMDg4YzMuNjE3LDMuNjE3LDcuODk4LDUuNDI0LDEyLjg0Nyw1LjQyNGM0Ljk1LDAsOS4yMzQtMS44MDcsMTIuODQ5LTUuNDI0DQoJCWw3My4wODctNzMuMDg4YzMuNjEzLTMuNjIsNS40MjEtNy45MDEsNS40MjEtMTIuODQ3YzAtNC45NDgtMS44MDgtOS4yMzItNS40MjEtMTIuODU0DQoJCUMzMzguMTQyLDQwMy44MDIsMzMzLjg1Nyw0MDEuOTk0LDMyOC45MDYsNDAxLjk5NHoiLz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjwvc3ZnPg0K'
	const exclamation = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE2LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPg0KPCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCINCgkgd2lkdGg9IjQ3My41MzJweCIgaGVpZ2h0PSI0NzMuNTMycHgiIHZpZXdCb3g9IjAgMCA0NzMuNTMyIDQ3My41MzIiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDQ3My41MzIgNDczLjUzMjsiDQoJIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPGc+DQoJPGc+DQoJCTxwYXRoIGQ9Ik0yMjguMzI2LDMwOS41MDNjLTYuNTczLDEuOTItMTEuODgyLDYuODU1LTE1Ljc4MiwxNC42NzZjLTQuMDE5LDguMDU0LTUuMzI5LDE1LjE3My00LjAwNCwyMS43NDMNCgkJCWMwLjg3OCw0LjM1NywyLjc1Nyw5LjAyOSw1LjAyLDEyLjUwMmM1Ljk4NCw5LjE4MiwxNS45MTIsMTQuNDM4LDI3LjI0MSwxNC40NDJsMCwwYzYuMTM5LDAsMTIuMzg1LTEuNTQ0LDE4LjA4Mi00LjQ2OQ0KCQkJYzkuMDgtNC42NTYsMTUuNTk1LTEyLjg0OCwxNy40MjMtMjEuOTA2YzEuNTk1LTcuODQxLTAuNDgyLTE1LjY4Ny01Ljg0LTIyLjA3OUMyNjAuNTc5LDMxMi42MSwyNDEuNTcyLDMwNS42MjksMjI4LjMyNiwzMDkuNTAzeg0KCQkJIE0yNTMuMjk2LDM0MS41NDVjLTAuMTExLDEuMzk2LTEuNzU3LDMuOTQtNi4wNDIsNi41Yy01LjAwMiwyLjk5Ni0xMS40MjYsMS42Mi0xNC41MDgtMy4xMDcNCgkJCWMtMS43MzYtMi42NjYtMS41NjEtNy40NzUsMC4zODktMTAuNTAyYzAuNjI5LTAuOTc1LDEuNTcyLTEuODczLDQuMjA3LTEuODczYzEuMzQ4LDAsMi45MjUsMC4yMzgsNC44MDksMC43MzYNCgkJCWMzLjIwNCwwLjg0Myw2LjIzLDIuMzg3LDguNzM5LDQuNDc0QzI1Mi4wNDIsMzM4Ljc0MiwyNTMuNDA5LDM0MC4xODUsMjUzLjI5NiwzNDEuNTQ1eiIvPg0KCQk8cGF0aCBkPSJNMjcwLjk3OCwxMDkuMzA0Yy0wLjAxLDAtMC4wMiwwLTAuMDM1LDBjLTAuNTYzLTAuMTQ3LTEuMTU4LTAuMjU2LTEuNzcyLTAuMzM1Yy0xOS45ODEtMi40MzMtNDAuMjUzLTQuMTE4LTYwLjI1LTUuMDE3DQoJCQlsLTAuNjctMC4wMTVjLTIuMjQ3LDAtNC4zNzksMC41My02LjIzLDEuNTMzYy02LjAxNSwxLjQ1Mi0xMC4wNTcsNi40NDQtMTAuMTcxLDEyLjczYy0wLjU4MSwzMy4zNzgsNC45OTcsNjYuNDM4LDEwLjQsOTguNDExDQoJCQljMy45MSwyMy4xNTYsNy45NTIsNDcuMDk5LDkuNTY0LDcwLjc3MWMwLjMsNC40NDMsMi41MzcsOC4yNTgsNi4xNzgsMTAuNTgzYzIuMzk2LDIuMjM5LDUuNDg0LDMuNDEyLDguOTg1LDMuNDEyaDI0LjEwNw0KCQkJYzUuOTc4LDAsMTAuODE2LTMuNTY0LDEyLjU1My05LjE2YzAuOTYtMS42ODEsMS41NTQtMy41MDksMS43NjMtNS40NTRjMi4zMi0yMS42MTcsNC45Mi00My41NzksNy40MjktNjQuODIzDQoJCQljMy44MzQtMzIuNDEsNy44LTY1LjkyMiwxMC44NjItOTkuMDFjMC40MzctNC43Mi0xLjM3Ny03LjgwNS0yLjk3Ny05LjU2MkMyNzguMzYyLDExMC43NzksMjc0LjgwNywxMDkuMzA0LDI3MC45NzgsMTA5LjMwNHoNCgkJCSBNMjM3Ljc0OCwyNzQuMzU0Yy0xLjk4LTIwLjAwOC01LjM0NS00MC4wMi04LjYxMi01OS40MmMtNC41ODUtMjcuMjY5LTkuMzE4LTU1LjQxMS0xMC4xMzgtODMuMzk2DQoJCQljMTIuMTE2LDAuNzEsMjQuMzQ3LDEuNzE2LDM2LjQ4OCwyLjk5OGMtMi44NjQsMjkuMDE2LTYuMzIyLDU4LjM3OS05LjY3OSw4Ni44MjNjLTIuMDc3LDE3LjY2MS00LjE1OSwzNS4zMTctNi4xMTQsNTIuOTgzaC0xLjk0NQ0KCQkJVjI3NC4zNTR6Ii8+DQoJCTxwYXRoIGQ9Ik00MjguNDI2LDIwMC4xMjNjMi44ODQtNC4xMDMsNi4yNjYtOS40NywxMC4zOTUtMTYuNDc4YzYuODI1LTExLjU4NSwxNC40MjEtMjUuODI5LDE1Ljk1LTI5Ljg4OQ0KCQkJYzAuOTg0LTIuNjE1LDAuODczLTUuNTIyLTAuMzExLTguMDU5Yy0xLjE3OC0yLjUzNC0zLjMzNi00LjQ4OS01Ljk3Mi01LjQxOGMtMS45Ny0wLjY5My00LjA4Ny0xLjQ2Ny02LjMwNy0yLjI4DQoJCQljLTEyLjAyLTQuMzgyLTI2LjU0OC05LjY4Ni00MC4zNTktMTEuMTM2YzUuMjcxLTE3LjEyMyw2LjAzNy0zNy42NzMsNC44NTQtNTAuMjgyYy0wLjI2NC0yLjgxMy0xLjY2LTUuMzk3LTMuODY5LTcuMTU3DQoJCQljLTIuMjA0LTEuNzU3LTUuMDE4LTIuNTQyLTcuODM2LTIuMTc5Yy0xNC42NzUsMS45MjUtMzIuOTM2LDQuNjU0LTUwLjU0MSw5LjE5OWMtMC40NDctMi44MjMtMC44NjgtNS43MDMtMS4zMDUtOC42NTgNCgkJCWMtMi4wNTctMTMuOTM5LTQuMTgtMjguMzYtOS41ODgtNDEuOTIxYy0xLjc5Mi00LjQ5Ny02LjQ1My03LjE1NS0xMS4yNDItNi40MjZjLTE2LjUyMywyLjU0NC0zMC4xMTIsMTMuODczLTQyLjEwMiwyMy44NzINCgkJCWMtMS43NDIsMS40NTctMy40NTMsMi44ODItNS4xMzQsNC4yNWMtNi43NjQtMTAuODE2LTEzLjk3OS0yMS40MDMtMjEuMDE4LTMxLjcyYy0yLjU1NS0zLjc1NS01LjExMy03LjUwMi03LjY0My0xMS4yNTINCgkJCUMyNDQuNDY2LDEuNzIyLDI0MS4yMzcsMCwyMzcuNzc5LDBjLTMuNDU4LDAtNi42OTMsMS43MjItOC42MjUsNC41ODhjLTMuNTYyLDUuMjg5LTYuODgxLDEwLjg4Ny0xMC4wODMsMTYuMw0KCQkJYy01LjI5NCw4LjkzOS0xMC4yOTEsMTcuMzg0LTE2LjI2MiwyNC40ODFjLTEuMzI1LDEuNTgyLTIuMjM5LDIuNTg5LTIuODY0LDMuMjM1Yy0xLjc2Ny0wLjgxNS00LjQyNS0yLjMyOS01Ljc0LTMuMDgzDQoJCQljLTEyLjIzLTYuOTY0LTI1LjA2Ny0xNy4wMDMtMzYuNjgxLTI2LjA3OGMtNC41MTctMy41MzItMTEuMDU1LTIuNzM0LTE0LjU5NCwxLjc4OGMtMS44MjYsMi4zMzYtMi40OTYsNS4yMDgtMi4wOTcsNy45MjcNCgkJCWMtMC4zNzQsMy4wNzctMi4xMzYsMTEuMTE1LTUuMjU2LDIzLjk0Yy0wLjU1NiwyLjI5Mi0wLjkzNywzLjg5NS0xLjAyMSw0LjMzMmMtMC41NjIsMi45MjgtMC45Niw1LjczNS0xLjMzMSw4LjM2MQ0KCQkJYy0wLjQ5MywzLjQ5NC0xLjI0Miw4Ljc3Mi0yLjEsOS44Yy0wLjAxLDAuMDA1LTAuODYzLDAuNDktMy41NTcsMC40OWMtMC44NDgsMC0xLjc1Ny0wLjA0OC0yLjc1LTAuMTM1DQoJCQljLTkuMzgxLTAuODQ4LTE5LjUyNy0zLjM1NC0yOS4zMzgtNS43NzhjLTUuMzA0LTEuMzExLTEwLjU2Ny0yLjYwNS0xNS43MzctMy42ODJjLTMuNDMtMC43MDYtNi45ODIsMC4zNTUtOS40NTgsMi44MjgNCgkJCWMtMi40NzYsMi40NzYtMy41NDIsNi4wMzMtMi44MjksOS40NmMwLjI1OSwxLjI2NywwLjc3NCw0Ljc0OCwxLjQ4Myw5LjQxN2MyLjc5LDE4LjQ4Myw0Ljg5NywzMS4xNTYsNi44MTcsMzkuOTA3DQoJCQljLTE3Ljc4NiwyLjIwOS00MC42MjIsOS43NzEtNDguMzQ1LDEyLjcwM2MtMy4yMTEsMS4yMjQtNS41NzgsMy45OTQtNi4zODUsNy4zMzJjLTAuOCwzLjM0NCwwLjEzNyw2LjkxMSwyLjQ0NSw5LjQ1Mw0KCQkJYzMuMTM2LDMuNDYzLDIxLjU0MywyOS4xNTUsMjguMjMxLDQwLjU5MWMtMTAuMjI5LDkuMTQ2LTMwLjgxNSwyNS4zNjktMzguMjQsMjguMTU3Yy0zLjgwMS0wLjc2NC03Ljg3OCwwLjYxNC0xMC4zNzQsMy45MQ0KCQkJYy0zLjQ2OCw0LjU3NS0yLjU3NSwxMS4xMDEsMi4wMDUsMTQuNTY4YzQuMDY4LDMuMDgyLDEwLjI4Niw2LjI3NiwxNy40ODQsOS45NjljNy42ODYsMy45NSwyNS4wNDcsMTIuODU3LDI4LjU4NCwxOC4wNTcNCgkJCWMtMy40ODYsOC43MjktMjAuNDI2LDM1LjA0OS0yNi40NDksNDAuOTg5Yy0yLjkyOCwxLjE4OC01LjI3NiwzLjY5Ny02LjE0NSw2Ljk4N2MtMS40NjIsNS41NTYsMS44NTYsMTEuMjQzLDcuNDA5LDEyLjcwNWwwLDANCgkJCWM0Ljc5OSwxLjI2LDExLjgyNCwxLjkyLDE5Ljk2NywyLjY4N2M4Ljk5MSwwLjg0OSwyNi45MzEsMi41MzQsMzIuNjMxLDUuNDIzYzAuMTcsMTAuMDA0LTUuNTA3LDQwLjUwMi04LjU1NCw0Ny45NzMNCgkJCWMtMi4xNzMsMi4yOS0zLjI4OCw1LjUzNC0yLjcxOSw4Ljg5NmMwLjk1NSw1LjY1Niw2LjMxMiw5LjQ3LDExLjk3OSw4LjUyNWwwLDBjMC4wMSwwLDAuMDIsMCwwLjAzLTAuMDA1DQoJCQljNS45NzItMS4wMTEsMTIuNTIyLTMuMzUyLDE5LjQ1OS01LjgxOWM4LjkwNy0zLjE3OSwxOS4wMTItNi43NzQsMjYuNTkzLTYuNzc0YzIuNTU3LDAsNC41NzUsMC4zOTYsNi4xNiwxLjIwOQ0KCQkJYzQuOTA1LDIuOTIsNi45OTUsMjYuNjg5LDcuNzg1LDM1LjY0M2MwLjU2MSw2LjM2NywxLjA0NiwxMS44NjcsMS45MTQsMTYuMDg3YzAuOTkzLDQuODM5LDUuMjQ2LDguMzEyLDEwLjE4Nyw4LjMxMg0KCQkJYzMuNjc3LDAsMy42NzcsMCwyMi44ODktMTUuMDgyYzQuMjEyLTMuMzExLDcuNzI5LTYuMDY4LDguMjMxLTYuNDU0YzUuOTAzLTQuNDEyLDE0LjA4MS0xMC43OSwxOS4zMTktOC4zNTMNCgkJCWM1LjE2Nyw0Ljk2NiwyMi42OTYsMjkuMjA4LDI1LjY3MiwzNi43N2MtMC4xOTgsMy42ODcsMS41NzksNy4zNjgsNC45NTQsOS40MzljMS42OTYsMS4wMzYsMy41NzIsMS41MzQsNS40MjMsMS41MzQNCgkJCWMzLjUwMSwwLDYuOTE5LTEuNzY4LDguODc5LTQuOTcybDAsMGMwLjAwNS0wLjAxLDAuMDEtMC4wMjEsMC4wMTYtMC4wM2MyLjQ0Ny0zLjk5Nyw0Ljc4My04Ljk0Miw3LjI1Ni0xNC4xNzMNCgkJCWM2LjAwMi0xMi42OTUsMTQuMTc4LTI5Ljk4NSwyNC4xMS0zMC43NDJjNi42NTcsMi4wNTcsMzAuNDI3LDE1LjY0MSwzNi4yMDYsMjEuNzAzYzAuNjYsMy40MTIsMy4wMTEsNi40MDgsNi40OTQsNy43MzkNCgkJCWM1LjM2MywyLjA2MiwxMS4zNzUtMC42MywxMy40MzItNS45ODdjMC40MjItMS4xMDIsMS41MzMtNC4wMTIsNy4yMTYtMzIuNzY4YzEuNDUyLTcuMzMzLDIuNTYtMTIuOTM5LDMuMzgyLTE3LjI4MQ0KCQkJYzIuMDIxLDAuNTM5LDQuMTA0LDEuMTAzLDYuMjE2LDEuNjgyYzEzLjA3LDMuNTYsMjcuODgzLDcuNTk3LDQxLjA4MSw3LjU5N2wwLDBjMi4wNTYsMCw0LjA1Ny0wLjEwMiw2LjAwNy0wLjMNCgkJCWM1LjU2MS0wLjU3NCw5LjY3OS01LjQ0Myw5LjMxMi0xMS4wMjljLTAuMTkyLTIuODktMS44NDgtMTEuMTk3LTYuNzI4LTM0LjY5M2MtMS4yMDktNS44MDQtMi41NzUtMTIuMzg1LTMuNjA1LTE3LjQ5Mw0KCQkJYzMuMTc0LTAuOTA5LDYuMzA3LTEuODQ5LDkuMzg5LTIuNzgzYzEzLjM3MS00LjAyNiwyNi03LjgzLDM4LjkyMy04LjIxNmMzLjQ4My0wLjEwMiw2LjY4OC0xLjkzOSw4LjUyNi00LjkNCgkJCWMxLjg0My0yLjk2LDIuMDc2LTYuNjQ2LDAuNjI5LTkuODE1Yy02LjU5MS0xNC40MTEtMTcuMDE2LTI4Ljk2LTI3LjA5MS00Mi4zYzQuMDAyLTIuNTM5LDkuMTQxLTYuMDAyLDE1Ljg1OC0xMC43MjUNCgkJCWMyNC41NTMtMTcuMjU1LDI2LjcyMS0yMS4wMjcsMjcuNzY3LTIyLjg0MWMyLjM4Mi00LjE0NCwxLjYzLTkuMzc0LTEuODEyLTEyLjY4QzQ1Ny40NjIsMjE3LjEwMiw0NDIuNzgyLDIwOC40MjYsNDI4LjQyNiwyMDAuMTIzDQoJCQl6IE00MDkuOTIxLDI2MS4xYy0xLjUzOCwwLjI5NS0zLjA0MSwwLjkzNS00LjM3NywxLjk1Yy00LjU3LDMuNDc0LTUuNDUzLDEwLjAwNC0xLjk4LDE0LjU3M2wwLDBsMCwwYzAsMCwwLjAwNiwwLDAuMDA2LDAuMDExDQoJCQlsMi4wOTIsMi43NTJjNy43ODksMTAuMjA3LDE2LjMyNSwyMS4zOTQsMjMuMDQ0LDMyLjM3N2MtOS43MDQsMS43NjMtMTkuMDMyLDQuNTctMjguMTYzLDcuMzIzDQoJCQljLTYuMTI0LDEuODQzLTExLjg5NywzLjU4NS0xNy43NDcsNS4wMjZjLTkuOTAyLDIuNDAyLTguMTQ2LDExLjE5Mi02LjI4NiwyMC41MDVjMS4wMDUsNS4wNTMsMi40MjIsMTEuODU3LDMuODg1LDE4Ljg5MQ0KCQkJYzEuMjg5LDYuMTk1LDIuOTE5LDE0LjA3Niw0LjIwOSwyMC40NzljLTguNzQ0LTEuMDkyLTE4LjUyLTMuNzUzLTI4LjA1MS02LjM1M2MtNi4zMzctMS43MjctMTIuMzE0LTMuMzUyLTE3Ljk5MS00LjUzNQ0KCQkJbC0yLjE5MywxMC41NzJsLTEwLjI2My0xLjI1NGMtMC4zNiwyLjkzNi00LjI4NiwyMy40NTUtNy40NDksMzguOTYzYy0xMy44MTItOS43MTQtMzMuMTA0LTE5LjQ5OS0zOS45ODktMTkuNTk2DQoJCQljLTIwLjc3NCwwLTMyLjI5NiwxOS42NjItNDAuNTg2LDM2LjY5M2MtOC43ODItMTMuNTk5LTIwLjc2NC0yOC44MTItMjUuMzI5LTMxLjQzM2MtNC4xNDQtMi4zODctOC42NDctMy41OS0xMy4zNzMtMy41OQ0KCQkJYy0xMS45MDMsMC0yMS45Nyw3LjUzLTI5LjMyOCwxMy4wMjVjLTAuMzkxLDAuMjk0LTQuMTEzLDMuMjA5LTguNTg0LDYuNzIzYy0wLjU4OSwwLjQ2OC0xLjE5MSwwLjkzNS0xLjgsMS40MTINCgkJCWMtMS43OTctMTkuODkxLTQuNDk3LTQxLjIzMy0xOC42NjItNDguNDk1Yy00LjUzNS0yLjMyNS05LjgwMy0zLjUwNC0xNS42NTgtMy41MDRjLTEwLjQ5NiwwLTIxLjYzNSwzLjc0My0zMS42NDYsNy4zMDMNCgkJCWM0LjA0Ny0xNy41OCw4LjM2OS00My40ODgsMi42MzMtNTEuMDY0Yy03LjI0OS05LjU4Ny0yMy45OTktMTIuMDI0LTQ2Ljg5Ny0xNC4yMDhjOS40OTMtMTMuMzU1LDI0LjE5NC0zNi4wNDksMjIuNzU5LTQ1LjA5OA0KCQkJYy0yLjIzNy0xNC4xMDYtMTkuNjA4LTIzLjY5OS0zNy4yMzEtMzIuNzc4YzE3LjQzLTExLjU3LDM2LjI1OS0yOS40NzUsMzYuNTA4LTI5Ljc0NGM2Ljc4Mi03LjIwMywyLjM4Ny0xNS4wNjktMTIuOTc0LTM3LjU0OQ0KCQkJYy0zLjE2Ni00LjYzOS02LjkzMS05Ljk3NC0xMC4zNjctMTQuNzIyYzEyLjE2Mi0zLjcwMiwyNy40NDktNy40NzcsMzYuNDY1LTcuNDc3YzEuOTQ1LDAsMi45MDcsMC4xODgsMy4yMjksMC4yNzINCgkJCWM1LjU5MSwxLjQwNCwxMS4yMjMtMS45ODYsMTIuNjIyLTcuNTU3YzAuODc0LTMuNDg4LTAuMTI3LTcuMDE1LTIuMzcyLTkuNTA2Yy0yLjMyLTYuMjkyLTUuODk4LTI4LjcxOC03LjgwNS00MS4xODgNCgkJCWMwLjA2NiwwLjAxNiwwLjEyOSwwLjAzMSwwLjE5NSwwLjA1NGMxMC41NzIsMi42MSwyMS41MDMsNS4zMTQsMzIuNDY0LDYuMjk3YzEuNjU4LDAuMTQ5LDMuMTk0LDAuMjE4LDQuNjE4LDAuMjE4DQoJCQljMjIuMjU5LDAsMjQuNjYxLTE2Ljk1MywyNi4yNDgtMjguMTY3YzAuMzI4LTIuMzIxLDAuNjctNC43ODYsMS4xNS03LjI3YzAuMTA0LTAuNDcsMC40MDMtMS43MTEsMC44Mi0zLjQyOA0KCQkJYzEuMDYyLTQuMzQ3LDEuOTg4LTguMTUyLDIuNzczLTExLjQ5NmM4LjE2Myw2LjEzOSwxNi43NDIsMTIuMTc3LDI1LjM0OSwxNy4wODJjNi42NzUsMy44MDEsMTEuNDYxLDYuMjk3LDE2Ljg5OSw2LjI5Nw0KCQkJYzguNTU0LDAsMTMuNzQ5LTYuMTcyLDE3LjkxNy0xMS4xMjhjNy4wNzktOC40MDksMTIuNzU2LTE3Ljk5NywxOC4yNDgtMjcuMjc0YzAuMzk4LTAuNjc1LDAuOC0xLjM1MSwxLjE5NS0yLjAyMw0KCQkJYzguNTgyLDEyLjU4NiwxNy4zNjcsMjUuNTU4LDI1LjAwOSwzOC41ODVjMS40NDcsMi40OCwzLjg1OSw0LjI0Myw2LjY1OCw0Ljg3N2MyLjgwOCwwLjY0LDUuNzQzLDAuMDg2LDguMTI0LTEuNTE4DQoJCQljNS4yOTctMy41NzMsMTAuNTEyLTcuOTIyLDE1LjU2NC0xMi4xMzJjNy43MzgtNi40NTksMTUuNjg2LTEzLjA4MywyMy43MDQtMTYuNzI5YzIuNDYzLDguODU2LDMuODY0LDE4LjM1Miw1LjMyMSwyOC4yNTcNCgkJCWMxLjAwNiw2Ljg3LDIuMDU3LDEzLjk3NywzLjQ5OSwyMC44OThjMC42LDIuODc2LDIuMzg3LDUuMzU5LDQuOTIsNi44NDhjMi41MzksMS40ODcsNS41ODYsMS44MzUsOC4zNzksMC45NDcNCgkJCWMxNS4yMzQtNC43ODksMzIuNjcyLTcuOTM5LDQ3LjA1My0xMC4wNzJjLTAuMTMyLDE1LjcyNC0zLjI4NSwzMy41ODUtOS41NzIsNDIuNzFjLTIuNDc4LDMuNi0yLjQ0Miw4LjM2OSwwLjA5MiwxMS45MzMNCgkJCWMyLjU0NCwzLjU2Miw3LjAzMyw1LjE2NSwxMS4yNDgsMy45ODljMS44ODQtMC41MjEsNC4xMjgtMC43ODUsNi42NzctMC43ODVjMTAuNjg5LDAsMjQuMTAxLDQuNDQxLDM1LjcyNCw4LjYyOA0KCQkJYy02LjQ4NCwxMi4wOTMtMTcuNTM5LDMxLjA5LTIyLjQwMywzNi41NTljLTIuMjgsMC43OC00LjI5NiwyLjM1Mi01LjYwNiw0LjU5M2MtMi44NzksNC45MjgtMS4yNDksMTEuMjU1LDMuNjU2LDE0LjE3OA0KCQkJYzMuMjU1LDEuOTQ1LDYuNjExLDMuODg0LDEwLjAxNCw1Ljg1YzEwLjM0OSw1Ljk4NiwyMC45NTcsMTIuMTIxLDMwLjA2NiwxOS4wNzdDNDM1LjI2MSwyNDQuNjI3LDQxNS45MjQsMjU4LjAzOCw0MDkuOTIxLDI2MS4xeiINCgkJCS8+DQoJPC9nPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPC9zdmc+DQo='
	const triangle = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE2LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPg0KPCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCINCgkgd2lkdGg9IjI5Mi4zNjJweCIgaGVpZ2h0PSIyOTIuMzYxcHgiIHZpZXdCb3g9IjAgMCAyOTIuMzYyIDI5Mi4zNjEiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDI5Mi4zNjIgMjkyLjM2MTsiDQoJIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPGc+DQoJPHBhdGggZD0iTTI4Ni45MzUsMTk3LjI4N0wxNTkuMDI4LDY5LjM4MWMtMy42MTMtMy42MTctNy44OTUtNS40MjQtMTIuODQ3LTUuNDI0cy05LjIzMywxLjgwNy0xMi44NSw1LjQyNEw1LjQyNCwxOTcuMjg3DQoJCUMxLjgwNywyMDAuOTA0LDAsMjA1LjE4NiwwLDIxMC4xMzRzMS44MDcsOS4yMzMsNS40MjQsMTIuODQ3YzMuNjIxLDMuNjE3LDcuOTAyLDUuNDI1LDEyLjg1LDUuNDI1aDI1NS44MTMNCgkJYzQuOTQ5LDAsOS4yMzMtMS44MDgsMTIuODQ4LTUuNDI1YzMuNjEzLTMuNjEzLDUuNDI3LTcuODk4LDUuNDI3LTEyLjg0N1MyOTAuNTQ4LDIwMC45MDQsMjg2LjkzNSwxOTcuMjg3eiIvPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPC9zdmc+DQo='

	const arePrimitiveValsInObjsSame = (obj1, obj2) => !Object.keys(obj1).some(key => (obj1[key] === null || (typeof obj1[key] !== 'object' && typeof obj1[key] !== 'function')) && obj1[key] !== obj2[key])
	// 0 layers means obj only has primitive values
	// this func only works with obj literals layered with obj literals until base layer only primitive
	const checkNestedObjectsEquivalence = (objA, objB, layers) => {
		if (layers === 0) {
			return arePrimitiveValsInObjsSame(objA, objB);
		} else {
			const objAKeys = Object.keys(objA);
			const objBKeys = Object.keys(objB);
			if (objAKeys.length !== objBKeys.length) return false;
			const somethingIsNotEquivalent = objAKeys.some(key => {
				return !checkNestedObjectsEquivalence(objA[key], objB[key], layers - 1);
			})
			return !somethingIsNotEquivalent;
		}
	};
	const needToRedrawWidget = (widget, newData) => {
		const lastData = widget.data;
		// check primitives for equivalence
		if (!arePrimitiveValsInObjsSame(lastData, newData)) return true;
		// check nested objs for equivalence
		const monthlyModulesAreSame = checkNestedObjectsEquivalence(lastData.monthlyModulesData, newData.monthlyModulesData, 3);
		const monthlyOverallAreSame = checkNestedObjectsEquivalence(lastData.monthlyOverallData, newData.monthlyOverallData, 2);
		const annualModulesAreSame = checkNestedObjectsEquivalence(lastData.annualModulesData, newData.annualModulesData, 2);
		const annualOverallAreSame = checkNestedObjectsEquivalence(lastData.annualOverallData, newData.annualOverallData, 1);
		if (!monthlyModulesAreSame || !monthlyOverallAreSame || !annualModulesAreSame || !annualOverallAreSame) return true;

		//return false if nothing prompted true
		return false;
	};
	const margin = 5;
	const columnIndeces = {
		Item: 0,
		Status: 1,
		Availability: 2,
		Power: 3,
		Tons: 4,
		Efficiency: 5,
		Details: 6
	};
	const columns = ['Item', 'Status', 'Availability', 'Power', 'Tons', 'Efficiency', 'Details'];
	
	// Set up for data collection (indeces commented)
	const configEvapPoints = ['DP', 'MinimumDP', 'MaximumDP', 'Flow', 'MinimumFlow', 'MaximumFlow', 'EWT', 'LWT', 'MinimumLWT', 'MaximumLWT'];	// 0 - 9
	const configCondPoints = ['DP', 'MinimumDP', 'MaximumDP', 'Flow', 'MinimumFlow', 'MaximumFlow', 'LWT', 'EWT', 'MinimumEWT', 'MaximumEWT'];	// 10 - 19
	const operPowerPoints = ['Tons', 'PercentRLA', 'kW', 'Efficiency'];	// 20 - 23
	const operEvapPoints = ['DP', 'Flow', 'EWT', 'LWT', 'DeltaT'];	// 24 - 28
	const operCondPoints = ['DP', 'Flow', 'EWT', 'LWT', 'DeltaT'];	// 29 - 33
	const operStatusPoints = ['Available', 'Running', 'Called'];	//34 - 36


	const dataSort = (column, currentSort, sortableTableData) => {
		if (currentSort.column === column) {
			currentSort.ascending = !currentSort.ascending;
		} else {
			currentSort.column = column;
			currentSort.ascending = true;
		}

		sortableTableData = sortableTableData.sort((a, b) => {
			if (currentSort.ascending) {
				return a[columnIndeces[column]].value > b[columnIndeces[column]].value ? 1 : -1;
			} else {
				return b[columnIndeces[column]].value > a[columnIndeces[column]].value ? 1 : -1;
			}
		});
	};

	const runningColor = '#22b573'
	const unavailableColor = '#Ecb550'
	const headerAndDetailsFill = '#425867'
	const evenNumberRowFill = '#e0e0e0'
	const oddNumberRowFill = '#F5F5F5'

	const meterBackgroundColor = '#d4d4d4'
	const rlaMeterColor = '#22b573'
	const oddEvapMeterColor = '#1dc1e4'
	const evenEvapMeterColor = '#3Ea9f5'
	const oddCondMeterColor = '#Ecb550'
	const evenCondMeterColor = '#d53d3b'

	const fonts = {
		Item: 'bold 11.5pt Nirmala UI',
		Status: 'bold 11.5pt Nirmala UI',
		Availability: 'bold 11.5pt Nirmala UI',
		Power: '11.5pt Nirmala UI',
		Tons: '11.5pt Nirmala UI',
		Efficiency: '11.5pt Nirmala UI',
		headers: '10.5pt Nirmala UI',
		detailsSectionTitle: 'bold 10.5pt Nirmala UI',
		detailsValue: 'bold 10.5pt Nirmala UI',
		detailsLabel: '10.5pt Nirmala UI'
	}

	////////////////////////////////////////////////////////////////
		// Define Widget Constructor & Exposed Properties
	////////////////////////////////////////////////////////////////
	const properties = [
		{
			name: 'overrideDefaultPrecisionWFacets',
			value: false
		},
		{
			name: 'overrideDefaultUnitsWFacets',
			value: false
		}
	];



	////////////////////////////////////////////////////////////////
		// /* SETUP DEFINITIONS AND DATA */
	////////////////////////////////////////////////////////////////
	const setupDefinitions = widget => {
		// FROM USER // 
		const data = {};
		properties.forEach(prop => data[prop.name] = prop.value);

		// FROM JQ //
		data.jqHeight = 270;
		data.jqWidth = 680;

		// SIZING //
		data.graphicHeight = data.jqHeight - (margin * 2);
		data.graphicWidth = data.jqWidth - (margin * 2);



		// DATA TO POPULATE //
		data.unsortableTableData = [];


		

		// FAKE DATA //
		const populateFakeData = () => {

			// FAKE DATA
				data.unsortableTableData.push([
					{column: 'Item', value: 0, displayValue: 'Chiller 1'},
					{column: 'Status', value: 'Running', displayValue: 'Running', exclamation: false},
					{column: 'Availability', value: 'Available', displayValue: 'Available'},
					{column: 'Power', value: 5, displayValue: JsUtils.formatValueToPrecision(5, 0) + ' kW'},
					{column: 'Tons', value: 30, displayValue: JsUtils.formatValueToPrecision(30, 0) + ' tR'},
					{column: 'Efficiency', value: 0.897563453, displayValue: JsUtils.formatValueToPrecision(0.897563453, 3) + ' kW/tR'},
					{column: 'Details', value: {
						evaporator: {
							dp: {value: 10, min: 0, max: 100, design: 50, precision: 1, units: 'psi'},
							flow: {value: 50, min: 0, max: 100, design: 50, precision: 0, units: 'gpm'},
							lwt: {value: 60, min: 0, max: 100, design: 50, precision: 1, units: '°F'},
							ewt: {value: 20, min: 0, max: 100, design: 50, precision: 1, units: '°F'},
							dt: {value: 30, displayValue: JsUtils.formatValueToPrecision(30, 1) + ' °F'}
						},
						condenser: {
							dp: {value: 30, min: 0, max: 100, design: 50, precision: 1, units: 'psi'},
							flow: {value: 60, min: 0, max: 100, design: 50, precision: 0, units: 'gpm'},
							ewt: {value: 30, min: 0, max: 100, design: 50, precision: 1, units: '°F'},
							lwt: {value: 50, min: 0, max: 100, design: 50, precision: 1, units: '°F'},
							dt: {value: 20, displayValue: JsUtils.formatValueToPrecision(20, 1) + ' °F'}
						},
						status: {value: 38, min: 0, max: 100, design: 50, precision: 0, units: '%'}
					}}
				]);

				data.unsortableTableData.push([
					{column: 'Item', value: 1, displayValue: 'Chiller 2'},
					{column: 'Status', value: 'Off', displayValue: 'Off', exclamation: false},
					{column: 'Availability', value: 'Available', displayValue: 'Available'},
					{column: 'Power', value: 2, displayValue: JsUtils.formatValueToPrecision(2, 0) + ' kW'},
					{column: 'Tons', value: 40, displayValue: JsUtils.formatValueToPrecision(40, 0) + ' tR'},
					{column: 'Efficiency', value: 1.0175634530, displayValue: JsUtils.formatValueToPrecision(1.0175634530, 3) + ' kW/tR'},
					{column: 'Details', value: {
						evaporator: {
							dp: {value: 20, min: 0, max: 100, design: 50, precision: 1, units: 'psi'},
							flow: {value: 90, min: 0, max: 100, design: 50, precision: 0, units: 'gpm'},
							lwt: {value: 40, min: 0, max: 100, design: 50, precision: 1, units: '°F'},
							ewt: {value: 20, min: 0, max: 100, design: 50, precision: 1, units: '°F'},
							dt: {value: 50, displayValue: JsUtils.formatValueToPrecision(50, 1) + ' °F'}
						},
						condenser: {
							dp: {value: 40, min: 0, max: 100, design: 50, precision: 1, units: 'psi'},
							flow: {value: 90, min: 0, max: 100, design: 50, precision: 0, units: 'gpm'},
							ewt: {value: 40, min: 0, max: 100, design: 50, precision: 1, units: '°F'},
							lwt: {value: 20, min: 0, max: 100, design: 50, precision: 1, units: '°F'},
							dt: {value: 40, displayValue: JsUtils.formatValueToPrecision(40, 1) + ' °F'}
						},
						status: {value: 38, min: 0, max: 100, design: 50, precision: 0, units: '%'}
					}}
				]);

				data.unsortableTableData.push([
					{column: 'Item', value: 2, displayValue: 'Chiller 3'},
					{column: 'Status', value: 'Off', displayValue: 'Off', exclamation: false},
					{column: 'Availability', value: 'Unavailable', displayValue: 'Unavailable'},
					{column: 'Power', value: 7, displayValue: JsUtils.formatValueToPrecision(7, 0) + ' kW'},
					{column: 'Tons', value: 20, displayValue: JsUtils.formatValueToPrecision(20, 0) + ' tR'},
					{column: 'Efficiency', value: 1.5475634530, displayValue: JsUtils.formatValueToPrecision(1.5475634530, 3) + ' kW/tR'},
					{column: 'Details', value: {
						evaporator: {
							dp: {value: 70, min: 0, max: 100, design: 50, precision: 1, units: 'psi'},
							flow: {value: 80, min: 0, max: 100, design: 50, precision: 0, units: 'gpm'},
							lwt: {value: 30, min: 0, max: 100, design: 50, precision: 1, units: '°F'},
							ewt: {value: 10, min: 0, max: 100, design: 50, precision: 1, units: '°F'},
							dt: {value: 70, displayValue: JsUtils.formatValueToPrecision(70, 1) + ' °F'}
						},
						condenser: {
							dp: {value: 10, min: 0, max: 100, design: 50, precision: 1, units: 'psi'},
							flow: {value: 10, min: 0, max: 100, design: 50, precision: 0, units: 'gpm'},
							ewt: {value: 70, min: 0, max: 100, design: 50, precision: 1, units: '°F'},
							lwt: {value: 90, min: 0, max: 100, design: 50, precision: 1, units: '°F'},
							dt: {value: 30, displayValue: JsUtils.formatValueToPrecision(30, 1) + ' °F'}
						},
						status: {value: 38, min: 0, max: 100, design: 50, precision: 0, units: '%'}
					}}
				]);

				data.unsortableTableData.push([
					{column: 'Item', value: 3, displayValue: 'Chiller 4'},
					{column: 'Status', value: 'Off', displayValue: 'Off', exclamation: false},
					{column: 'Availability', value: 'Available', displayValue: 'Available'},
					{column: 'Power', value: 20, displayValue: JsUtils.formatValueToPrecision(20, 0) + ' kW'},
					{column: 'Tons', value: 80, displayValue: JsUtils.formatValueToPrecision(80, 0) + ' tR'},
					{column: 'Efficiency', value: 0.688634530, displayValue: JsUtils.formatValueToPrecision(0.688634530, 3) + ' kW/tR'},
					{column: 'Details', value: {
						evaporator: {
							dp: {value: 90, min: 0, max: 100, design: 50, precision: 1, units: 'psi'},
							flow: {value: 20, min: 0, max: 100, design: 50, precision: 0, units: 'gpm'},
							lwt: {value: 60, min: 0, max: 100, design: 50, precision: 1, units: '°F'},
							ewt: {value: 60, min: 0, max: 100, design: 50, precision: 1, units: '°F'},
							dt: {value: 30, displayValue: JsUtils.formatValueToPrecision(30, 1) + ' °F'}
						},
						condenser: {
							dp: {value: 50, min: 0, max: 100, design: 50, precision: 1, units: 'psi'},
							flow: {value: 90, min: 0, max: 100, design: 50, precision: 0, units: 'gpm'},
							ewt: {value: 20, min: 0, max: 100, design: 50, precision: 1, units: '°F'},
							lwt: {value: 60, min: 0, max: 100, design: 50, precision: 1, units: '°F'},
							dt: {value: 50, displayValue: JsUtils.formatValueToPrecision(50, 1) + ' °F'}
						},
						status: {value: 38, min: 0, max: 100, design: 50, precision: 0, units: '%'}
					}}
				]);

				data.unsortableTableData.push([
					{column: 'Item', value: 4, displayValue: 'Chiller 5'},
					{column: 'Status', value: 'Running', displayValue: 'Running', exclamation: true},
					{column: 'Availability', value: 'Available', displayValue: 'Available'},
					{column: 'Power', value: 5, displayValue: JsUtils.formatValueToPrecision(5, 0) + ' kW'},
					{column: 'Tons', value: 10, displayValue: JsUtils.formatValueToPrecision(10, 0) + ' tR'},
					{column: 'Efficiency', value: 1.8975634530, displayValue: JsUtils.formatValueToPrecision(1.8975634530, 3) + ' kW/tR'},
					{column: 'Details', value: {
						evaporator: {
							dp: {value: 70, min: 0, max: 100, design: 50, precision: 1, units: 'psi'},
							flow: {value: 20, min: 0, max: 100, design: 50, precision: 0, units: 'gpm'},
							lwt: {value: 50, min: 0, max: 100, design: 50, precision: 1, units: '°F'},
							ewt: {value: 70, min: 0, max: 100, design: 50, precision: 1, units: '°F'},
							dt: {value: 20, displayValue: JsUtils.formatValueToPrecision(20, 1) + ' °F'}
						},
						condenser: {
							dp: {value: 10, min: 0, max: 100, design: 50, precision: 1, units: 'psi'},
							flow: {value: 60, min: 0, max: 100, design: 50, precision: 0, units: 'gpm'},
							ewt: {value: 50, min: 0, max: 100, design: 50, precision: 1, units: '°F'},
							lwt: {value: 20, min: 0, max: 100, design: 50, precision: 1, units: '°F'},
							dt: {value: 60, displayValue: JsUtils.formatValueToPrecision(60, 1) + ' °F'}
						},
						status: {value: 38, min: 0, max: 100, design: 50, precision: 0, units: '%'}
					}}
				]);

				data.unsortableTableData.push([
					{column: 'Item', value: 5, displayValue: 'Chiller 6'},
					{column: 'Status', value: 'Off', displayValue: 'Off', exclamation: false},
					{column: 'Availability', value: 'Unavailable', displayValue: 'Unavailable'},
					{column: 'Power', value: 7, displayValue: JsUtils.formatValueToPrecision(7, 0) + ' kW'},
					{column: 'Tons', value: 20, displayValue: JsUtils.formatValueToPrecision(20, 0) + ' tR'},
					{column: 'Efficiency', value: 1.5475634530, displayValue: JsUtils.formatValueToPrecision(1.5475634530, 3) + ' kW/tR'},
					{column: 'Details', value: {
						evaporator: {
							dp: {value: 70, min: 0, max: 100, design: 50, precision: 1, units: 'psi'},
							flow: {value: 80, min: 0, max: 100, design: 50, precision: 0, units: 'gpm'},
							lwt: {value: 30, min: 0, max: 100, design: 50, precision: 1, units: '°F'},
							ewt: {value: 10, min: 0, max: 100, design: 50, precision: 1, units: '°F'},
							dt: {value: 70, displayValue: JsUtils.formatValueToPrecision(70, 1) + ' °F'}
						},
						condenser: {
							dp: {value: 10, min: 0, max: 100, design: 50, precision: 1, units: 'psi'},
							flow: {value: 10, min: 0, max: 100, design: 50, precision: 0, units: 'gpm'},
							ewt: {value: 70, min: 0, max: 100, design: 50, precision: 1, units: '°F'},
							lwt: {value: 90, min: 0, max: 100, design: 50, precision: 1, units: '°F'},
							dt: {value: 30, displayValue: JsUtils.formatValueToPrecision(30, 1) + ' °F'}
						},
						status: {value: 38, min: 0, max: 100, design: 50, precision: 0, units: '%'}
					}}
				]);

				data.unsortableTableData.push([
					{column: 'Item', value: 6, displayValue: 'Chiller 7'},
					{column: 'Status', value: 'Off', displayValue: 'Off', exclamation: false},
					{column: 'Availability', value: 'Available', displayValue: 'Available'},
					{column: 'Power', value: 20, displayValue: JsUtils.formatValueToPrecision(20, 0) + ' kW'},
					{column: 'Tons', value: 80, displayValue: JsUtils.formatValueToPrecision(80, 0) + ' tR'},
					{column: 'Efficiency', value: 0.688634530, displayValue: JsUtils.formatValueToPrecision(0.688634530, 3) + ' kW/tR'},
					{column: 'Details', value: {
						evaporator: {
							dp: {value: 90, min: 0, max: 100, design: 50, precision: 1, units: 'psi'},
							flow: {value: 20, min: 0, max: 100, design: 50, precision: 0, units: 'gpm'},
							lwt: {value: 60, min: 0, max: 100, design: 50, precision: 1, units: '°F'},
							ewt: {value: 60, min: 0, max: 100, design: 50, precision: 1, units: '°F'},
							dt: {value: 30, displayValue: JsUtils.formatValueToPrecision(30, 1) + ' °F'}
						},
						condenser: {
							dp: {value: 50, min: 0, max: 100, design: 50, precision: 1, units: 'psi'},
							flow: {value: 90, min: 0, max: 100, design: 50, precision: 0, units: 'gpm'},
							ewt: {value: 20, min: 0, max: 100, design: 50, precision: 1, units: '°F'},
							lwt: {value: 60, min: 0, max: 100, design: 50, precision: 1, units: '°F'},
							dt: {value: 50, displayValue: JsUtils.formatValueToPrecision(50, 1) + ' °F'}
						},
						status: {value: 38, min: 0, max: 100, design: 50, precision: 0, units: '%'}
					}}
				]);

				data.unsortableTableData.push([
					{column: 'Item', value: 7, displayValue: 'Chiller 888'},	//15 char max including spaces
					{column: 'Status', value: 'Running', displayValue: 'Running', exclamation: false},
					{column: 'Availability', value: 'Available', displayValue: 'Available'},
					{column: 'Power', value: 5, displayValue: JsUtils.formatValueToPrecision(5, 0) + ' kW'},
					{column: 'Tons', value: 10, displayValue: JsUtils.formatValueToPrecision(10, 0) + ' tR'},
					{column: 'Efficiency', value: 1.8975634530, displayValue: JsUtils.formatValueToPrecision(1.8975634530, 3) + ' kW/tR'},
					{column: 'Details', value: {
						evaporator: {
							dp: {value: 70, min: 0, max: 100, design: 50, precision: 1, units: 'psi'},
							flow: {value: 20, min: 0, max: 100, design: 50, precision: 0, units: 'gpm'},
							lwt: {value: 50, min: 0, max: 100, design: 50, precision: 1, units: '°F'},
							ewt: {value: 70, min: 0, max: 100, design: 50, precision: 1, units: '°F'},
							dt: {value: 20, displayValue: JsUtils.formatValueToPrecision(20, 1) + ' °F'}
						},
						condenser: {
							dp: {value: 10, min: 0, max: 100, design: 50, precision: 1, units: 'psi'},
							flow: {value: 60, min: 0, max: 100, design: 50, precision: 0, units: 'gpm'},
							ewt: {value: 50, min: 0, max: 100, design: 50, precision: 1, units: '°F'},
							lwt: {value: 20, min: 0, max: 100, design: 50, precision: 1, units: '°F'},
							dt: {value: 60, displayValue: JsUtils.formatValueToPrecision(60, 1) + ' °F'}
						},
						status: {value: 38, min: 0, max: 100, design: 50, precision: 0, units: '%'}
					}}
				]);

				data.unsortableTableData.push([
					{column: 'Item', value: 8, displayValue: 'Chiller 9'},
					{column: 'Status', value: 'Off', displayValue: 'Off', exclamation: false},
					{column: 'Availability', value: 'Available', displayValue: 'Available'},
					{column: 'Power', value: 20, displayValue: JsUtils.formatValueToPrecision(20, 0) + ' kW'},
					{column: 'Tons', value: 80, displayValue: JsUtils.formatValueToPrecision(80, 0) + ' tR'},
					{column: 'Efficiency', value: 0.688634530, displayValue: JsUtils.formatValueToPrecision(0.688634530, 3) + ' kW/tR'},
					{column: 'Details', value: {
						evaporator: {
							dp: {value: 90, min: 0, max: 100, design: 50, precision: 1, units: 'psi'},
							flow: {value: 20, min: 0, max: 100, design: 50, precision: 0, units: 'gpm'},
							lwt: {value: 60, min: 0, max: 100, design: 50, precision: 1, units: '°F'},
							ewt: {value: 60, min: 0, max: 100, design: 50, precision: 1, units: '°F'},
							dt: {value: 30, displayValue: JsUtils.formatValueToPrecision(30, 1) + ' °F'}
						},
						condenser: {
							dp: {value: 50, min: 0, max: 100, design: 50, precision: 1, units: 'psi'},
							flow: {value: 90, min: 0, max: 100, design: 50, precision: 0, units: 'gpm'},
							ewt: {value: 20, min: 0, max: 100, design: 50, precision: 1, units: '°F'},
							lwt: {value: 60, min: 0, max: 100, design: 50, precision: 1, units: '°F'},
							dt: {value: 50, displayValue: JsUtils.formatValueToPrecision(50, 1) + ' °F'}
						},
						status: {value: 38, min: 0, max: 100, design: 50, precision: 0, units: '%'}
					}}
				]);

				data.unsortableTableData.push([
					{column: 'Item', value: 9, displayValue: 'Chiller 10'},
					{column: 'Status', value: 'Running', displayValue: 'Running', exclamation: false},
					{column: 'Availability', value: 'Available', displayValue: 'Available'},
					{column: 'Power', value: 5, displayValue: JsUtils.formatValueToPrecision(5, 0) + ' kW'},
					{column: 'Tons', value: 10, displayValue: JsUtils.formatValueToPrecision(10, 0) + ' tR'},
					{column: 'Efficiency', value: 1.8975634530, displayValue: JsUtils.formatValueToPrecision(1.8975634530, 3) + ' kW/tR'},
					{column: 'Details', value: {
						evaporator: {
							dp: {value: 70, min: 0, max: 100, design: 50, precision: 1, units: 'psi'},
							flow: {value: 20, min: 0, max: 100, design: 50, precision: 0, units: 'gpm'},
							lwt: {value: 50, min: 0, max: 100, design: 50, precision: 1, units: '°F'},
							ewt: {value: 70, min: 0, max: 100, design: 50, precision: 1, units: '°F'},
							dt: {value: 20, displayValue: JsUtils.formatValueToPrecision(20, 1) + ' °F'}
						},
						condenser: {
							dp: {value: 10, min: 0, max: 100, design: 50, precision: 1, units: 'psi'},
							flow: {value: 60, min: 0, max: 100, design: 50, precision: 0, units: 'gpm'},
							ewt: {value: 50, min: 0, max: 100, design: 50, precision: 1, units: '°F'},
							lwt: {value: 20, min: 0, max: 100, design: 50, precision: 1, units: '°F'},
							dt: {value: 60, displayValue: JsUtils.formatValueToPrecision(60, 1) + ' °F'}
						},
						status: {value: 38, min: 0, max: 100, design: 50, precision: 0, units: '%'}
					}}
				]);

		};



		// CALCULATED DEFS //
		const calculateDefs = () => {
			// GLOBALS PER INSTANCE
			if (!widget.currentSort) widget.currentSort = { column: 'Item', ascending: true }; 
			if (!data.sortableTableData) data.sortableTableData = data.unsortableTableData.map(chillers => chillers.map(chiller => Object.assign({}, chiller)));
			if (!widget.hoveredRowIndex) widget.hoveredRowIndex = 'none';
			if (!widget.hoveredMeter) widget.hoveredMeter = 'none';
			if (!widget.openRows) widget.openRows = new Set();


			return data;
		};

		populateFakeData();
		return calculateDefs();
	};
		




	////////////////////////////////////////////////////////////////
		// RenderWidget Func
	////////////////////////////////////////////////////////////////

	const renderWidget = (widget, data) => {

		widget.outerDiv 
			.style('height', data.jqHeight + 'px')	//only for browser
			.style('width', data.jqWidth + 'px')		//only for browser

		// ********************************************* SIZING ETC ******************************************************* //
		const tableWidth = 680;
		const scrollbarWidth = 15 //approximate, changes per browser
		const colWidth = ((tableWidth - scrollbarWidth) / 6);
		const firstColWidth = colWidth + 20;
		const otherColWidth = ((tableWidth - scrollbarWidth) - 20) / 6

		const tableHeight = data.graphicHeight;
		const headerHeight = 30;
		const maxTbodyHeight = tableHeight - headerHeight;
		const rowHeight = 25;

		const detailsHeight = 180;
		const openRowHeight = detailsHeight + rowHeight;

		const hoveredRectHeight = rowHeight * 0.8;
		const hoveredRectWidth = JsUtils.getTextWidth('!', fonts.Item);
		const arrowWidth = JsUtils.getTextWidth('^', fonts.headers)

		// ********************************************* DRAW ******************************************************* //
		widget.graphicDiv 
			.attr('width', tableWidth + 'px')
			.attr('height', tableHeight + 'px')
		d3.select(widget.graphicDiv.node().parentNode).style('background-color', data.backgroundColor);
		// delete leftover elements from versions previously rendered
		if (!widget.graphicDiv.empty()) JsUtils.resetElements(widget.graphicDiv, '*');

		widget.graphicDiv.attr('transform', `translate(${margin}, ${margin})`);

		const table = widget.graphicDiv.append('table')
			.attr('class', 'table')
			.style('background-color', 'white')
			.style('width', tableWidth + 20 + 'px')
			.style('border-collapse', 'collapse')
			.style('text-align', 'center')
			.style('cursor', 'default')
			.style('table-layout', 'fixed')
	

		const thead = table.append('thead')
			.attr('class', 'thead')
			.style('display', 'block')
			.style('width', tableWidth + 'px')
			.style('height', headerHeight + 'px')
			.style('background-color', 'white')

		const tbody = table.append('tbody')
			.attr('class', 'tbody')
			.style('display', 'block')
			.style('max-height', maxTbodyHeight + 'px')
			.style('overflow-y', 'scroll')	//or scroll	
			.style('width', tableWidth + 'px')
			.style('table-layout', 'fixed')


		// ********************************************* THEAD ******************************************************* //
		const headerRow = thead.append('tr')
			.style('height', headerHeight + 'px')
			.style('color', 'white')
			.style('position', 'absolute')
			.style('width', tableWidth - scrollbarWidth)


		const headerCols = headerRow.selectAll('th')
			.data(columns.slice(0, -1))	//don't include Details
			.enter().append('th')
				.html(d => d)
				.style('position', 'absolute')
				.style('width', (d, i) => i === 0 ? firstColWidth + 'px' : otherColWidth + 'px')
				.style('height', headerHeight + 'px')
				.style('font', fonts.headers)
				.attr('class', d => `header ${d}Header`)
				.style('left', (d, i) => i ? firstColWidth + ((i-1) * otherColWidth) + 'px' : '0px')
				.style('padding-right', 0)
				.style('padding-left', 0)
				.on('click', function(d){
					dataSort(d, widget.currentSort, data.sortableTableData);
					drawTbody();
					drawHeaderArrows();
				});


		const headerSVG = headerRow.append('svg')
			.attr('position', 'absolute')
			.attr('class', 'headerSVG')
			.attr('height', headerHeight)
			.attr('width', tableWidth)
			.style('background-color', headerAndDetailsFill);


		function drawHeaderArrows() {
			JsUtils.resetElements(headerSVG, '.headerArrow')
			headerSVG.selectAll('.headerArrows')
				.data(columns.slice(0, -1))	//don't include Details
				.enter().append('svg:image')
					.attr('xlink:href', d => widget.currentSort.column === d ? (widget.currentSort.ascending ? downArrow : upArrow) : bothArrows)
					.attr('class', 'headerArrow')
					.attr('x', (d, i) => {
						const dWidth = JsUtils.getTextWidth(d, fonts.headers);
						const thisColWidth = i ? otherColWidth : firstColWidth;
						const xFromThisColStart = ((thisColWidth / 2) - (dWidth / 2)) - 21;
						if (i === 0) return xFromThisColStart;
						return firstColWidth + ((i - 1) * otherColWidth) + xFromThisColStart;
					})
					.attr('height', rowHeight)
					.attr('width', 17)
		}
		drawHeaderArrows();




		// ********************************************* TBODY ******************************************************* //
		const drawTbody = () => {
			if (!tbody.empty()) tbody.selectAll('*').remove();

			const rows = tbody.selectAll('.row')
				.data(data.sortableTableData)
				.enter().append('tr')
					.attr('class', 'row')
					.style('background-color', (d, i) => i%2 ? evenNumberRowFill : oddNumberRowFill)
					.attr('data-index', (d, i) => i)
					.on('mouseenter', hoverRow)
					.on('mouseleave', unhoverRow)

			
			const cells = rows.selectAll('.cell')
				.data(d => d.filter(obj => obj.column !== 'Details') )
				.enter().append('td')
					.attr('class', function(d) {return `cell ${d.column}Cell row${this.parentNode.getAttribute('data-index')}Cell`}) 
					.attr('data-index', function(){return this.parentNode.getAttribute('data-index')})
					.style('width', (d, i) => i === 0 ? firstColWidth + 'px' : otherColWidth + 'px')
					.style('padding-left', 0)
					.style('padding-right', 0)
					.style('height', rowHeight + 'px')
					.style('vertical-align', 'top')
					.style('overflow', 'hidden')


			const cellDivs = cells.append('div')
				.attr('data-index', function(){return this.parentNode.getAttribute('data-index')})
				.style('width', (d, i) => i === 0 ? firstColWidth + 'px' : otherColWidth + 'px')
				.style('height', rowHeight + 'px')
				.style('display', 'table-cell')
				.style('vertical-align', 'middle')
				.style('position', 'relative')
				.html(d => d.displayValue)
				.style('font', d => fonts[d.column])
				.style('background-color', d => d.displayValue === 'Running' ? runningColor : d.displayValue === 'Unavailable' ? unavailableColor : 'none')
				.style('color', d => d.displayValue === 'Running' || d.displayValue === 'Unavailable' ? 'white' : 'black')
				.style('border-radius', '8px')
				.style('word-break', 'break-all')
				.style('word-wrap', 'break-word')
				.each(function(d, i) {
					if (d.exclamation) d3.select(this).append('img')
						.attr('src', exclamation)
						.attr('height', 15)
						.attr('width', 15)
						.style('position', 'absolute')
						.style('right', '0px')
						.style('top', '0px')
						.attr('x', 10)
				})
				.on('click', function() {
					const rowIndex = +this.parentNode.getAttribute('data-index');
					const isCurrentlyOpen = widget.openRows.has(rowIndex);
					const thisRowCells = widget.graphicDiv.selectAll(`.row${rowIndex}Cell,.row${rowIndex}Svg`)
					if (isCurrentlyOpen) {
						thisRowCells.style('height', rowHeight + 'px');
						d3.select(this).select('.triangle').remove()
						widget.openRows.delete(rowIndex)
					} else {
						thisRowCells.style('height', openRowHeight + 'px');
						d3.select(this).append('svg:image')
							.attr('class', 'triangle')
							.attr('xlink:href', triangle)
							.attr('height', 10)
							.attr('width', 10)
							.attr('x', firstColWidth - 5)
							.attr('y', rowHeight - 3)
						widget.openRows.add(rowIndex)
					}
				})


			const svgs = rows.append('svg')
				.attr('class', function(d) {return `svg row${this.parentNode.getAttribute('data-index')}Svg`})
				.attr('data-index', function(){return this.parentNode.getAttribute('data-index')})
				.style('width', tableWidth - scrollbarWidth + 'px')
				.style('height', function () {return widget.openRows.has(this.parentNode.getAttribute('data-index')) ? openRowHeight + 'px' : rowHeight + 'px'})
				.style('margin-left', `-${tableWidth - scrollbarWidth}px`)
				.style('z-index', 80)
				.each(function() {
					const rowIndex = +this.parentNode.getAttribute('data-index');
					if (widget.openRows.has(rowIndex)) {
						d3.select(this).append('svg:image')
							.attr('class', 'triangle')
							.attr('xlink:href', triangle)
							.attr('height', 10)
							.attr('width', 10)
							.attr('x', firstColWidth - 5)
							.attr('y', rowHeight - 3)
					}
				})
				.on('click', function() {
					const rowIndex = +this.parentNode.getAttribute('data-index');
					const isCurrentlyOpen = widget.openRows.has(rowIndex);
					const thisRowCells = widget.graphicDiv.selectAll(`.row${rowIndex}Cell,.row${rowIndex}Svg`)
					if (isCurrentlyOpen) {
						thisRowCells.style('height', rowHeight + 'px');
						d3.select(this).select('.triangle').remove()
						widget.openRows.delete(rowIndex)
					} else {
						thisRowCells.style('height', openRowHeight + 'px');
						d3.select(this).append('svg:image')
							.attr('class', 'triangle')
							.attr('xlink:href', triangle)
							.attr('height', 10)
							.attr('width', 10)
							.attr('x', firstColWidth - 5)
							.attr('y', rowHeight - 3)
						widget.openRows.add(rowIndex)
					}
				})


			// hovered rects 
			function hoverRow(d, i) {
				widget.hoveredRowIndex = i;
				widget.outerDiv.select(`.row${i}Svg`).append('rect')
					.attr('class', 'hoveredRect')
					.attr('height', hoveredRectWidth)
					.attr('width', hoveredRectWidth)
					.attr('fill', '#1dc1e4')
					.attr('rx', 3)
					.attr('ry', 3)
					.attr('y', (rowHeight / 2) - (hoveredRectWidth / 2) )
					.attr('x', 5)
					.transition()
						.duration(200)
						.attr('height', hoveredRectHeight)
						.attr('y', (rowHeight / 2) - (hoveredRectHeight / 2))
			}
			if (widget.hoveredRowIndex !== 'none') {
				hoverRow(null, widget.hoveredRowIndex);
			}

			function unhoverRow() {
				widget.hoveredRowIndex = 'none'
				widget.outerDiv.selectAll('.hoveredRect')
					.transition()
						.duration(200)
						.attr('height', hoveredRectWidth)
						.attr('y', (rowHeight / 2) - (hoveredRectWidth / 2))
						.remove();
			}





			// ********************************************* DETAILS ******************************************************* //
			//details rect
			svgs.append('rect')
				.attr('height', detailsHeight)
				.attr('y', rowHeight + 4)
				.attr('width', tableWidth - scrollbarWidth)
				.attr('fill', headerAndDetailsFill)


			const detailsHorizontalMargin = 40;
			const marginLeftOfDT = 15;
			const DTWidth = JsUtils.getTextWidth('8.8 °F', fonts.detailsValue)
			const meterWidth = ((tableWidth - scrollbarWidth) - ( (detailsHorizontalMargin * 4) + (marginLeftOfDT * 2) + (DTWidth * 2) )) / 3;
			const detailsVerticalMargin = 10;
			const marginBelowDetailsValue = 2;
			const detailsSectionTitleHeight = JsUtils.getTextHeight(fonts.detailsSectionTitle);
			const detailsValueHeight = JsUtils.getTextHeight(fonts.detailsValue);
			const detailsLabelHeight = JsUtils.getTextHeight(fonts.detailsLabel);
			const meterHeight = (detailsHeight - ( (detailsVerticalMargin * 6) + detailsSectionTitleHeight )) / 4
			const detailsColumnIndex = columnIndeces.Details;
			// const tooltipHeight = detailsHeight - (detailsSectionTitleHeight + detailsValueHeight + marginBelowDetailsValue + meterHeight + (detailsVerticalMargin * 5))


			const detailsCol1s = svgs.append('g')
				.attr('class', 'detailsCol1s')
				.attr('data-index', function(){return this.parentNode.getAttribute('data-index')})
				.attr('transform', `translate(${detailsHorizontalMargin}, ${rowHeight + detailsSectionTitleHeight + detailsVerticalMargin})`)
			const detailsCol2s = svgs.append('g')
				.attr('class', 'detailsCol2s')
				.attr('data-index', function(){return this.parentNode.getAttribute('data-index')})
				.attr('transform', `translate(${(detailsHorizontalMargin * 2) + meterWidth}, ${rowHeight + detailsSectionTitleHeight + detailsVerticalMargin})`)
			const detailsCol3s = svgs.append('g')
				.attr('class', 'detailsCol3s')
				.attr('data-index', function(){return this.parentNode.getAttribute('data-index')})
				.attr('transform', `translate(${(detailsHorizontalMargin * 2) + (meterWidth * 2) + marginLeftOfDT}, ${rowHeight + detailsValueHeight + detailsSectionTitleHeight + (detailsVerticalMargin * 4) + detailsSectionTitleHeight + (detailsValueHeight * 3) + (marginBelowDetailsValue * 3) + meterHeight})`)
			const detailsCol4s = svgs.append('g')
				.attr('class', 'detailsCol4s')
				.attr('data-index', function(){return this.parentNode.getAttribute('data-index')})
				.attr('transform', `translate(${(detailsHorizontalMargin * 3) + (meterWidth * 2) + marginLeftOfDT + DTWidth}, ${rowHeight + detailsSectionTitleHeight + detailsVerticalMargin})`)
			const detailsCol5s = svgs.append('g')
				.attr('class', 'detailsCol5s')
				.attr('data-index', function(){return this.parentNode.getAttribute('data-index')})
				.attr('transform', `translate(${(detailsHorizontalMargin * 3) + (meterWidth * 3) + (marginLeftOfDT * 2) + DTWidth}, ${rowHeight + detailsValueHeight + detailsSectionTitleHeight + (detailsVerticalMargin * 4) + detailsSectionTitleHeight + (detailsValueHeight * 3) + (marginBelowDetailsValue * 3) + meterHeight})`)

			//Section Titles
			detailsCol1s.append('text')
				.style('font', fonts.detailsSectionTitle)
				.attr('fill', 'white')
				.text('STATUS')

			detailsCol2s.append('text')
				.style('font', fonts.detailsSectionTitle)
				.attr('fill', 'white')
				.text('EVAPORATOR')

			detailsCol4s.append('text')
				.style('font', fonts.detailsSectionTitle)
				.attr('fill', 'white')
				.text('CONDENSER')

			
			//Delta Ts
			detailsCol3s.append('text')
				.style('font', fonts.detailsValue)
				.attr('fill', 'white')
				.text(function() {
					const rowIndex = this.parentNode.getAttribute('data-index');
					const chillerObject = data.sortableTableData[rowIndex];
					return chillerObject[detailsColumnIndex].value.evaporator.dt.displayValue;
				})
			detailsCol3s.append('text')
				.style('font', fonts.detailsLabel)
				.attr('fill', 'white')
				.attr('y', marginBelowDetailsValue + detailsLabelHeight)
				.text('DT')

			detailsCol5s.append('text')
				.style('font', fonts.detailsValue)
				.attr('fill', 'white')
				.text(function() {
					const rowIndex = this.parentNode.getAttribute('data-index');
					const chillerObject = data.sortableTableData[rowIndex];
					return chillerObject[detailsColumnIndex].value.condenser.dt.displayValue;
				})
			detailsCol5s.append('text')
				.style('font', fonts.detailsLabel)
				.attr('fill', 'white')
				.attr('y', marginBelowDetailsValue + detailsLabelHeight)
				.text('DT')


			//Tooltip Location
			const arrayOfChillerDetails = [];
			const tooltipGroups = detailsCol1s.append('g')
				.attr('class', function() {return `tooltipGroup tooltipGroup${this.parentNode.getAttribute('data-index')}`})
				.attr('data-index', function(){return this.parentNode.getAttribute('data-index')})
				.attr('transform', `translate(0, ${detailsVerticalMargin + detailsValueHeight + marginBelowDetailsValue + meterHeight + (detailsVerticalMargin * 3)})`)
				.each(function() {
					const chillerIndex = this.getAttribute('data-index')
					arrayOfChillerDetails[chillerIndex] = data.sortableTableData[chillerIndex][columnIndeces.Details].value;
				})

			//Col 1s Meter
			const col1MetersGroups = detailsCol1s.append('g')
				.attr('class', function() {return `meterGroup col1MeterGroup${this.parentNode.getAttribute('data-index')}`})
				.attr('transform', `translate(0, ${detailsVerticalMargin})`)


			arrayOfChillerDetails.forEach((chillerDetails, index) => {
				const chillerStatus = chillerDetails.status;
				const rlaMeter = new Meter(widget.graphicDiv.select('.col1MeterGroup' + index), widget.graphicDiv.select('.tooltipGroup' + index), meterBackgroundColor, rlaMeterColor, 'white', meterHeight, meterWidth, '%RLA', chillerStatus.units, chillerStatus.precision, fonts.detailsLabel, fonts.detailsValue, fonts.detailsValue, chillerStatus.value, chillerStatus.min, chillerStatus.max, true, null, widget.hoveredMeter === '.col1MeterGroup' + index);
				rlaMeter.create();
				rlaMeter.callbackOnHover(() => widget.hoveredMeter = '.col1MeterGroup' + index);
				rlaMeter.callbackOnUnhover(() => widget.hoveredMeter = 'none')
			})


			//Col 2s Meters
			const col2Groups = detailsCol2s.append('g')
				.attr('data-index', function(){return this.parentNode.getAttribute('data-index')})
				.attr('transform', `translate(0, ${detailsVerticalMargin})`)
			
			const col2MetersGroups = col2Groups.selectAll('.col2MetersGroups')
				.data(['Dp', 'Flow', 'Lwt', 'Ewt'])
				.enter().append('g')
					.attr('class', function(d) {return `meterGroup col2MeterGroup${this.parentNode.getAttribute('data-index') + d}`})
					.attr('transform', (d, i) => `translate(0, ${(meterHeight * i) + (detailsVerticalMargin * i)})`)
					.each(function(d, i) {
							const index = this.parentNode.getAttribute('data-index');
							const typeDetails = arrayOfChillerDetails[index].evaporator[d.toLowerCase()];
							const col2Meters = new Meter(widget.graphicDiv.select('.col2MeterGroup' + index + d), widget.graphicDiv.select('.tooltipGroup' + index), meterBackgroundColor, i%2 ? evenEvapMeterColor : oddEvapMeterColor, 'white', meterHeight, meterWidth, d, typeDetails.units, typeDetails.precision, fonts.detailsLabel, fonts.detailsValue, fonts.detailsValue, typeDetails.value, typeDetails.min, typeDetails.max, true, typeDetails.design, widget.hoveredMeter === '.col2MeterGroup' + index + d);
							col2Meters.create();
							col2Meters.callbackOnHover(() => widget.hoveredMeter = '.col2MeterGroup' + index + d);
							col2Meters.callbackOnUnhover(() => widget.hoveredMeter = 'none')
					})


			//Col 4s Meters
			const col4Groups = detailsCol4s.append('g')
				.attr('data-index', function(){return this.parentNode.getAttribute('data-index')})
				.attr('transform', `translate(0, ${detailsVerticalMargin})`)
			
			const col4MetersGroups = col4Groups.selectAll('.col4MetersGroups')
				.data(['Dp', 'Flow', 'Ewt', 'Lwt'])
				.enter().append('g')
					.attr('class', function(d) {return `meterGroup col4MeterGroup${this.parentNode.getAttribute('data-index') + d}`})
					.attr('transform', (d, i) => `translate(0, ${(meterHeight * i) + (detailsVerticalMargin * i)})`)
					.each(function(d, i) {
							const index = this.parentNode.getAttribute('data-index');
							const typeDetails = arrayOfChillerDetails[index].condenser[d.toLowerCase()];
							const col4Meters = new Meter(widget.graphicDiv.select('.col4MeterGroup' + index + d), widget.graphicDiv.select('.tooltipGroup' + index), meterBackgroundColor, i%2 ? evenCondMeterColor : oddCondMeterColor, 'white', meterHeight, meterWidth, d, typeDetails.units, typeDetails.precision, fonts.detailsLabel, fonts.detailsValue, fonts.detailsValue, typeDetails.value, typeDetails.min, typeDetails.max, true, typeDetails.design, widget.hoveredMeter === '.col4MeterGroup' + index + d);
							col4Meters.create();
							col4Meters.callbackOnHover(() => widget.hoveredMeter = '.col4MeterGroup' + index + d);
							col4Meters.callbackOnUnhover(() => widget.hoveredMeter = 'none')
					})





		}

		drawTbody();









console.log('data', data)



		






	};
	






	////////////////////////////////////////////////////////////////
		// Render Func
	////////////////////////////////////////////////////////////////

	function render(widget, force) {
		// invoking setupDefinitions, then returning value to renderWidget func
		let theData = setupDefinitions(widget);
		if (force || !widget.data || needToRedrawWidget(widget, theData)){
			renderWidget(widget, theData);	
		}
		widget.data = theData;
	}






	////////////////////////////////////////////////////////////////
		// Initialize Widget
	////////////////////////////////////////////////////////////////
	function initialize() {
		const widget = {};

		widget.outerDiv = d3.select('#outer')
			.style('overflow', 'hidden');
		widget.graphicDiv = widget.outerDiv.append('div')
			.attr('class', 'ChillersReport')
			.style('overflow', 'hidden');

		render(widget);
	}





initialize();

}

defineFuncForTabSpacing();