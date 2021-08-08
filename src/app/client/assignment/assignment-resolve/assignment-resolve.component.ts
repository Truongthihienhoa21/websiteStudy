import { AuthService } from 'src/app/service/auth.service';
import { FalconMessageService } from 'src/app/service/falcon-message.service';
import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { filter, map, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import {
  MonacoEditorComponent,
  MonacoEditorConstructionOptions,
  MonacoEditorLoaderService,
  MonacoStandaloneCodeEditor,
} from '@materia-ui/ngx-monaco-editor';
import { HttpClient, HttpParams } from '@angular/common/http';
import { combineLatest, of, Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { AssignmentService } from '../assignment.service';

@Component({
  selector: 'app-assignment-resolve',
  templateUrl: './assignment-resolve.component.html',
  styleUrls: ['./assignment-resolve.component.scss'],
})
export class AssignmentResolveComponent implements OnInit, OnDestroy {
  editorOptions: MonacoEditorConstructionOptions = {
    theme: 'myCustomTheme',
    roundedSelection: true,
    autoIndent: 'full',
    autoClosingQuotes: 'always',
    quickSuggestions: true,
    language: 'typescript',
  };
  code: any;
  output: any;
  url = 'https://judge0-extra.p.rapidapi.com';
  headers = {
    'x-rapidapi-key': 'edb9f8abbemsh5f4e019a2d04baep1d54f9jsn7e130a5eb98b',
    'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
  };

  languages: any[];
  selectedLanguages;
  items = [
    {
      label: 'File',
      styleClass: 'file',
      items: [
        {
          label: 'New',
          icon: 'pi pi-fw pi-plus',
          items: [{ label: 'Project' }, { label: 'Other' }],
        },
        { label: 'Open' },
        { label: 'Quit' },
      ],
    },
  ];

  outputProp: any = [
    { label: 'Đầu vào', value: '' },
    { label: 'Đầu ra thực tế', value: '' },
    { label: 'Đầu ra mong muốn', value: '' },
    { label: 'Giới hạn thời gian', value: 4000 },
    { label: 'Thời gian thực hiện', value: '' },
    { label: 'Tin nhắn', value: '' },
  ];

  task: any;
  loading: boolean;
  unsubscription = new Subject();
  assign: any;
  currentId: any;
  originalAssign: any;
  sectionIndx: any;
  taskIndx: any;
  userInfo: any;
  constructor(
    private monacoLoaderService: MonacoEditorLoaderService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private assignService: AssignmentService,
    private router: Router,
    private messageService: FalconMessageService,
    private authService: AuthService
  ) {
    this.monacoLoaderService.isMonacoLoaded$
      .pipe(
        filter((isLoaded) => isLoaded),
        takeUntil(this.unsubscription)
      )
      .subscribe(() => {
        monaco.editor.defineTheme('myCustomTheme', {
          base: 'vs-dark',
          inherit: true,
          rules: [
            {
              token: 'comment',
              foreground: 'ffa500',
              fontStyle: 'italic underline',
            },
            { token: 'comment.js', foreground: '008800', fontStyle: 'bold' },
            { token: 'comment.css', foreground: '0000ff' },
          ],
          colors: {},
        });
      });
  }

  @ViewChild(MonacoEditorComponent, { static: true })
  monacoComponent: MonacoEditorComponent;

  ngOnInit() {
    this.output = this.defaultOutput();
    combineLatest([this.route.params, this.authService.userDetail$]).pipe(
      switchMap(([idAss, userInfo]) => {
        this.userInfo = userInfo;
        const { id, section, task } = idAss;
        this.sectionIndx = section;
        this.taskIndx = task;
        const assignment = userInfo.assignment;
        if (assignment && assignment.length) {
          const assDetail = assignment.find(ass => ass._id === idAss.id);
          if (assDetail) {

            return combineLatest([
              of(assDetail),
              of(section),
              of(task),
            ])
          }
        }
        return combineLatest([
          this.assignService.findById(id),
          of(section),
          of(task),
        ])

      }),
      takeUntil(this.unsubscription)
    ).subscribe(([assign, section, task]: any) => {
      this.originalAssign = assign;
      this.assign = assign.lists_assignment[section - 1];
      this.task = assign.lists_assignment[section - 1].chapters[task - 1];
      this.outputProp[2].value = this.task.answer;
      this.currentId = task - 1;
      this.loading = false;
    });

    // this.route.params
    //   .pipe(
    //     tap(() => (this.loading = true)),
    //     switchMap(({ id, section, task }) => {
    //       this.sectionIndx = section;
    //       this.taskIndx = task;
    //       return combineLatest([
    //         this.assignService.findById(id),
    //         of(section),
    //         of(task),
    //       ])
    //     }
    //     ),
    //     takeUntil(this.unsubscription)
    //   )
    //   .subscribe(([assign, section, task]: any) => {
    //     this.originalAssign = assign;
    //     this.assign = assign.lists_assignment[section - 1];
    //     this.task = assign.lists_assignment[section - 1].chapters[task - 1];
    //     this.outputProp[2].value = this.task.answer;
    //     this.currentId = task - 1;
    //     this.loading = false;
    //   });

    this.getLanguages()
      .pipe(takeUntil(this.unsubscription))
      .subscribe((val) => {
        this.languages = val;
        this.selectedLanguages = val[45];

        const model = monaco.editor.getModels()[0];

        const language = this.selectedLanguages.name
          .split(' ')[0]
          .toLowerCase();

        monaco.editor.setModelLanguage(model, language);
      });
  }

  ngOnDestroy() {
    this.unsubscription.next();
    this.unsubscription.unsubscribe();
  }

  onNavigate(index) {
    this.output = this.defaultOutput()
    this.route.params
      .pipe(takeUntil(this.unsubscription))
      .subscribe(({ id, section, task }) => {
        this.router.navigate(['assignment', id, section, index + 1]);
      });
  }

  editorInit(editor: MonacoStandaloneCodeEditor) {
    editor.setSelection({
      startLineNumber: 1,
      startColumn: 1,
      endColumn: 50,
      endLineNumber: 3,
    });
  }

  onChange(event) {
    if (this.selectedLanguages) {
      const model = monaco.editor.getModels()[0];
      const language = this.selectedLanguages.name.split(' ')[0].toLowerCase();
      monaco.editor.setModelLanguage(model, language);
    }
  }

  getCode(token) {
    const params = new HttpParams()
      .set('base64_encoded', 'true')
      .set('fields', '*');

    const get = () => {
      return this.http
        .get(`${this.url}/submissions/${token}`, {
          headers: this.headers,
          params,
        })
        .pipe
        // mergeMap((val: any) => {
        //   // if (!val.time) {
        //   //   return get();
        //   // }
        //   return of(val);
        // })
        ();
    };

    get()
      .pipe(takeUntil(this.unsubscription))
      .subscribe(
        (val: any) => {
          this.loading = false;
          // console.log(val);
          if (val.stdout) {
            const result = atob(val.stdout);


            this.outputProp[1].value = result;
            if (this.outputProp[2].value.trim() == result.trim()) {
              this.outputProp[4].value = val.time;
              this.outputProp[5].value = 'Kết quả đúng';
              console.log(this.originalAssign, this.assign, this.sectionIndx, this.task);
              this.task.done = true;
              this.originalAssign.lists_assignment[this.sectionIndx - 1].chapters[this.taskIndx - 1] = { ...this.task }
              this.authService.userDetail$.pipe(
                switchMap(val => {
                  const userAss = val.assignment ? val.assignment : []
                  const body = { ...val, assignment: [...userAss, this.originalAssign] }

                  return this.authService.updateUser(val._id, body)
                }),
                takeUntil(this.unsubscription)
              ).subscribe(
                (val: any) => {
                  this.authService.userInfo.next(val._id)
                }
              )
              this.messageService.showSuccess(`Chúc mừng ${this.userInfo.username}`, 'Bạn vừa hoàn thành bài tập này.')
            } else {
              this.outputProp[4].value = val.time;
              this.outputProp[5].value = 'Kết quả sai';
            }

          } else if (val.stderr) {
            const error = atob(val.stderr);
            this.outputProp[1].value = '';
            this.outputProp[4].value = val.time;
            this.outputProp[5].value = error;

          } else {
            const compilation_error = atob(val.compile_output);
            this.outputProp[1].value = '';
            this.outputProp[4].value = val.time;
            this.outputProp[5].value = compilation_error;

          }
        },
        (err) => {
          // console.log(err);
        }
      );
  }

  postCode() {
    this.loading = true;
    const body = {
      language_id: this.selectedLanguages.id,
      source_code: this.code,
    };

    this.http
      .post(`${this.url}/submissions`, body, { headers: this.headers })
      .subscribe(
        (val: any) => {
          this.getCode(val.token);
          this.output = '';
        },
        (err) => {
        }
      );
  }

  getLanguages() {
    return this.http.get<any[]>(`${this.url}/languages`, {
      headers: this.headers,
    });
  }

  defaultOutput() {
    return ([
      { label: 'Đầu vào', value: '' },
      { label: 'Đầu ra thực tế', value: '' },
      { label: 'Đầu ra mong muốn', value: '' },
      { label: 'Giới hạn thời gian', value: 4000 },
      { label: 'Thời gian thực hiện', value: '' },
      { label: 'Tin nhắn', value: '' },
    ]);
  }
}
