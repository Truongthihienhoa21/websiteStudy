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
  output = '';
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

  outputProp = [
    { label: 'Input', value: '' },
    { label: 'Actual output', value: '' },
    { label: 'Expected output', value: '' },
    { label: 'Execute time limit', value: 4000 },
    { label: 'Execute time', value: '' },
  ];

  task: any;
  loading: boolean;
  unsubscription = new Subject();
  assign: any;
  currentId: any;
  constructor(
    private monacoLoaderService: MonacoEditorLoaderService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private assignService: AssignmentService,
    private router: Router
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
    this.route.params
      .pipe(
        tap(() => (this.loading = true)),
        switchMap(({ id, section, task }) =>
          combineLatest([
            this.assignService.findById(id),
            of(section),
            of(task),
          ])
        ),
        takeUntil(this.unsubscription)
      )
      .subscribe(([assign, section, task]: any) => {
        this.assign = assign.lists_assignment[section - 1];
        this.task = assign.lists_assignment[section - 1].chapters[task - 1];
        this.outputProp[2].value = this.task.answer;
        this.currentId = task - 1;
        this.loading = false;
      });

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
            this.outputProp[4].value = val.time;
          } else if (val.stderr) {
            const error = atob(val.stderr);
            this.outputProp[1].value = error;
            this.outputProp[4].value = val.time;
          } else {
            const compilation_error = atob(val.compile_output);
            this.outputProp[1].value = compilation_error;
            this.outputProp[4].value = val.time;
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
          console.log(err);
        }
      );
  }

  getLanguages() {
    return this.http.get<any[]>(`${this.url}/languages`, {
      headers: this.headers,
    });
  }
}
