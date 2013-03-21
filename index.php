<div id="toolbar">
  <div class="service">
    <form method="post" action="https://doc2html.ru" enctype="multipart/form-data" autocomplete="off" target="doc2html">
      <input name="receiver" type="hidden" value="">
      <input type="file" name="msword" id="msword" accept="application/msword">
    </form>

    <form method="post" action="/editor" enctype="multipart/form-data" autocomplete="off" target="picture">
      <input type="file" name="picture" id="picture" accept="image/*">
    </form>
  </div>

  <div class="tools">
    <ul class="organizer">
      <li title="Открыть">
        <label for="msword" class="shake">
          <img src="/im/editor/from-office.png" width="16" height="16">
        </label>
      </li>
      <li id="save" title="Сохранить">
        <p class="shake">
          <img src="/im/editor/disk.png" width="16" height="16">
        </p>
      </li>
    </ul>
  </div>

  <div class="tools">
    <ul class="organizer">
      <li id="hide-page">
        <input name="hide" type="text" value="" placeholder="Скрывать страницы">
      </li>
      <li id="story-undo" title="Назад">
        <p class="shake">
          <img src="/im/editor/story-undo.png" width="16" height="16">
        </p>
      </li>
      <li id="story-redo" title="Вперед">
        <p class="shake">
          <img src="/im/editor/story-redo.png" width="16" height="16">
        </p>
      </li>
      <li id="twist" data-move='{"tag": ".page", "spot": "grade", "tone": "album"}' title="Альбомная ориентация">
        <p class="shake">
          <img src="/im/editor/album-arroy.png" width="16" height="16">
        </p>
      </li>
      <li id="tag" data-move='{"tag": "p", "spot": "grade", "tone": "gap"}' class="transfer" title="Разрыв страницы">
        <p class="shake">
          <img src="/im/editor/page_gap2.png" width="16" height="16">
        </p>
      </li>
    </ul>
  </div>

  <div class="tools">
    <ul class="organizer">
      <li data-move='{"tag": "p", "spot": "css", "property": "text-align", "tone": "left", "normal": "justify"}' title="По левому краю">
        <p class="shake">
          <img src="/im/editor/paragraph_left.png" width="16" height="16">
        </p>
      </li>
      <li data-move='{"tag": "p", "spot": "css", "property": "text-align", "tone": "center", "normal": "justify"}' title="По центру">
        <p class="shake">
          <img src="/im/editor/paragraph_center.png" width="16" height="16">
        </p>
      </li>
      <li data-move='{"tag": "p", "spot": "css", "property": "text-align", "tone": "right", "normal": "justify"}' title="По правому краю">
        <p class="shake">
          <img src="/im/editor/paragraph_right.png" width="16" height="16">
        </p>
      </li>
      <li data-move='{"tag": "p", "spot": "grade", "tone": "ledge"}' class="feather" title="Типографика содержания">
        <p class="shake">
          <img src="/im/editor/paragraph_ledge.png" width="16" height="16">
        </p>
      </li>
    </ul>
  </div>

  <div class="tools">
    <ul class="organizer tracing">
      <li data-move='{"tag": "b", "spot": "self"}' title="Выделенный">
        <p class="shake">
          <b>Ж</b>
        </p>
      </li>
      <li data-move='{"tag": "i", "spot": "self"}' title="Курсив">
        <p class="shake">
          <i>К</i>
        </p>
      </li>
      <li data-move='{"tag": "p", "spot": "css", "property": "text-transform", "tone": "lowercase", "normal": "none"}' title="Строчными">
        <p class="shake">
          <span>а</span>
        </p>
      </li>
      <li data-move='{"tag": "p", "spot": "css", "property": "text-transform", "tone": "uppercase", "normal": "none"}' title="Прописными">
        <p class="shake">
          <span>А</span>
        </p>
      </li>
    </ul>
  </div>

  <div class="tools">
    <ul class="organizer">
      <li class="flap">
        <p class="shake" title="Шаблоны">
          <img src="/im/editor/template.png" width="16" height="16">
        </p>
        <div>
          <ul class="organizer">
            <li data-indent="above" title="Абзац выше">
              <p class="shake">
                <img src="/im/editor/indent_above.png" width="16" height="16">
              </p>
            </li>
            <li data-indent="below" title="Абзац ниже">
              <p class="shake">
                <img src="/im/editor/indent_below.png" width="16" height="16">
              </p>
            </li>
          </ul>
          <ul class="organizer tracing">
            <li data-move='{"tag": "sup", "spot": "self"}' title="Надстрочный">
              <p class="shake">
                <span>T</span><sup>н</sup>
              </p>
            </li>
            <li data-move='{"tag": "sub", "spot": "self"}' title="Подстрочный">
              <p class="shake">
                <span>T</span><sub>п</sub>
              </p>
            </li>
            <li class="flap">
              <p class="shake" title="Специальный символ">
                <img src="/im/editor/omega.png" width="16" height="16">
              </p>
              <div>
                <ul id="special-simbol" class="tracing">
                  <?php foreach (Editor::omega() as $val){ ?>
                    <li class="shake"><?php echo $val; ?></li>
                  <?php } ?>
                </ul>
              </div>
            </li>
          </ul>
          <ul class="organizer">
            <li id="dry" title="Очистить документ">
              <p class="shake">
                <img src="/im/editor/dry.png" width="16" height="16">
              </p>
            </li>
            <li id="ledge-style" title="Стиль многоточий">
              <p class="shake">
                <img src="/im/editor/ledge-style.png" width="16" height="16">
              </p>
            </li>
          </ul>
        </div>
      </li>
      <li data-move='{"tag": "a", "spot": "self"}' title="Ссылка">
        <p class="shake">
          <img src="/im/editor/link.png" width="16" height="16">
        </p>
      </li>
    </ul>
  </div>

  <div class="tools">
    <ul class="organizer">
      <li>
        <label for="picture" class="shake">
          <img src="/im/editor/image.png" title="Добавить рисунок">
        </label>
      </li>
      <li data-draw="above" title="Подпись сверху">
        <p class="shake">
          <img src="/im/editor/caption_above.png" width="16" height="16">
        </p>
      </li>
      <li data-draw="below" title="Подпись снизу">
        <p class="shake">
          <img src="/im/editor/caption_below.png" width="16" height="16">
        </p>
      </li>
      <li data-draw="exp" title="Без подписи">
        <p class="shake">
          <img src="/im/editor/caption_unwrap.png" width="16" height="16">
        </p>
      </li>
      <li data-draw="unset" title="Без окружения">
        <p class="shake">
          <img src="/im/editor/image_unset.png" width="16" height="16">
        </p>
      </li>
    </ul>
  </div>

  <div class="tools">
    <ul class="organizer">
      <li class="flap">
        <p class="shake" title="Границы таблицы">
          <img src="/im/editor/table.png" width="16" height="16">
        </p>
        <div>
          <ul class="organizer">
            <li data-move='{"tag": "table", "spot": "all", "ward": "td", "property": "border", "tone": "0px none rgb(0, 0, 0)"}'>
              <p class="shake">
                <img src="/im/editor/table_border_none.png" width="16" height="16">
              </p>
            </li>
            <li data-move='{"tag": "table", "spot": "all", "ward": "td", "property": "border", "tone": "1px solid rgb(0, 0, 0)"}'>
              <p class="shake">
                <img src="/im/editor/table_border_all.png" width="16" height="16">
              </p>
            </li>
            <li data-move='{"tag": "table", "spot": "css", "property": "border", "tone": "0px none rgb(0, 0, 0)"}'>
              <p class="shake">
                <img src="/im/editor/table_outline_none.png" width="16" height="16">
              </p>
            </li>
            <li data-move='{"tag": "table", "spot": "css", "property": "border", "tone": "1px solid rgb(0, 0, 0)"}'>
              <p class="shake">
                <img src="/im/editor/table_outline.png" width="16" height="16">
              </p>
            </li>
          </ul>
          <ul class="organizer">
            <li data-move='{"tag": "td", "spot": "css", "property": "border", "tone": "0px none rgb(0, 0, 0)"}'>
              <p class="shake">
                <img src="/im/editor/td_border_none.png" width="16" height="16">
              </p>
            </li>
            <li data-move='{"tag": "td", "spot": "css", "property": "border", "tone": "1px solid rgb(0, 0, 0)"}'>
              <p class="shake">
                <img src="/im/editor/td_border_all.png" width="16" height="16">
              </p>
            </li>
            <li data-move='{"tag": "td", "spot": "css", "property": "border-top", "tone": "1px solid rgb(0, 0, 0)"}'>
              <p class="shake">
                <img src="/im/editor/td_border_top.png" width="16" height="16">
              </p>
            </li>
            <li data-move='{"tag": "td", "spot": "css", "property": "border-right", "tone": "1px solid rgb(0, 0, 0)"}'>
              <p class="shake">
                <img src="/im/editor/td_border_right.png" width="16" height="16">
              </p>
            </li>
            <li data-move='{"tag": "td", "spot": "css", "property": "border-bottom", "tone": "1px solid rgb(0, 0, 0)"}'>
              <p class="shake">
                <img src="/im/editor/td_border_bottom.png" width="16" height="16">
              </p>
            </li>
            <li data-move='{"tag": "td", "spot": "css", "property": "border-left", "tone": "1px solid rgb(0, 0, 0)"}'>
              <p class="shake">
                <img src="/im/editor/td_border_left.png" width="16" height="16">
              </p>
            </li>
          </ul>
          <ul class="organizer">
            <li id="exp-table" title="Развернуть таблицу">
              <p class="shake">
                <img src="/im/editor/exp_table.png" width="16" height="16">
              </p>
            </li>
          </ul>
        </div>
      </li>
      <li data-move='{"tag": "table", "spot": "grade", "tone": "volume"}' title="Табличный стиль">
        <p class="shake">
          <img src="/im/editor/table-style.png" width="16" height="16">
        </p>
      </li>
      <li data-map="sever" title="Разбить таблицу">
        <p class="shake">
          <img src="/im/editor/table_gap.png" width="16" height="16">
        </p>
      </li>
      <li data-map="unite" title="Объединить таблицы">
        <p class="shake">
          <img src="/im/editor/table_unite.png" width="16" height="16">
        </p>
      </li>
      <li data-map="cnap" title="Удалить столбец таблицы">
        <p class="shake">
          <img src="/im/editor/table-column-unset.png" width="16" height="16">
        </p>
      </li>
      <li data-map="strike" title="Удалить строку таблицы">
        <p class="shake">
          <img src="/im/editor/tr-unset.png" width="16" height="16">
        </p>
      </li>
      <li data-map="height" title="Очистить высоту ячеек таблицы">
        <p class="shake">
          <img src="/im/editor/un_height.png" width="16" height="16">
        </p>
      </li>
      <li data-map="width" title="Очистить ширину ячеек таблицы">
        <p class="shake">
          <img src="/im/editor/un_width.png" width="16" height="16">
        </p>
      </li>
    </ul>
  </div>
</div>
<div id="monitor"></div>
<div id="space">
  <?php echo Editor::get_content(); ?>
</div>
